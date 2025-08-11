import * as pdfjsLib from 'pdfjs-dist';
import { AcademicEvaluation, RequiredCourse, PDFParseResult } from '../types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export class PDFParser {
  /**
   * Parse uploaded PDF file and extract academic evaluation data
   */
  static async parseAcademicEvaluation(file: File): Promise<PDFParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      // Parse the extracted text
      const evaluation = this.parseEvaluationText(fullText);
      
      return {
        success: true,
        data: evaluation
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error'
      };
    }
  }

  /**
   * Parse extracted text to find academic evaluation data
   * This method contains GSU-specific parsing logic for real GSU evaluations
   */
  private static parseEvaluationText(text: string): AcademicEvaluation {
    // Initialize evaluation object with defaults
    const evaluation: AcademicEvaluation = {
      totalCreditsRequired: 0,
      creditsCompleted: 0,
      creditsRemaining: 0,
      requiredCourses: [],
      lastUpdated: new Date()
    };

    // Parse student information using real GSU format
    evaluation.studentName = this.extractGSUStudentName(text);
    evaluation.studentId = this.extractGSUStudentId(text);
    evaluation.degreeProgram = this.extractGSUDegreeProgram(text);
    evaluation.gpa = this.extractGSUGPA(text);

    // Parse credit information from degree progress section
    const creditInfo = this.extractGSUCreditInfo(text);
    evaluation.totalCreditsRequired = creditInfo.required;
    evaluation.creditsCompleted = creditInfo.applied;
    evaluation.creditsRemaining = creditInfo.required - creditInfo.applied;

    // Parse required courses from "Still needed" sections
    evaluation.requiredCourses = this.extractGSURequiredCourses(text);

    return evaluation;
  }

  // GSU-specific extraction methods for real academic evaluations

  private static extractGSUStudentName(text: string): string | undefined {
    // Format: "Student name Syed, Anees Ibrahim" or "Student Name Syed, Anees Ibrahim"
    const namePattern = /Student name\s+([A-Za-z,\s]+)/i;
    const match = text.match(namePattern);
    return match ? match[1].trim() : undefined;
  }

  private static extractGSUStudentId(text: string): string | undefined {
    // Format: "Student ID *****5360" - extract the visible part
    const idPattern = /Student ID\s+(\*+\d+)/i;
    const match = text.match(idPattern);
    return match ? match[1] : undefined;
  }

  private static extractGSUDegreeProgram(text: string): string | undefined {
    // Format: "BS in Computer Science INCOMPLETE" - extract the degree part
    const programPattern = /(B[AS]\s+in\s+[A-Za-z\s]+)(?:\s+(?:INCOMPLETE|COMPLETE))?/i;
    const match = text.match(programPattern);
    return match ? match[1].trim() : undefined;
  }

  private static extractGSUGPA(text: string): number | undefined {
    // Format: "GSU GPA 3.94"
    const gpaPattern = /GSU GPA\s+(\d+\.?\d*)/i;
    const match = text.match(gpaPattern);
    return match ? parseFloat(match[1]) : undefined;
  }

  private static extractGSUCreditInfo(text: string): { required: number; applied: number } {
    // Format: "Credits required: 120 Credits applied: 55"
    const creditPattern = /Credits required:\s+(\d+)\s+Credits applied:\s+(\d+)/i;
    const match = text.match(creditPattern);
    
    if (match) {
      return {
        required: parseInt(match[1]),
        applied: parseInt(match[2])
      };
    }
    
    return { required: 0, applied: 0 };
  }

  private static extractGSURequiredCourses(text: string): RequiredCourse[] {
    const courses: RequiredCourse[] = [];
    
    // Simple approach: find all "Still needed" patterns throughout the text
    const stillNeededPattern = /Still needed:\s*([^]*?)(?=Still needed:|Course Title|Credits required:|[A-Z]{2,4}\s+\d{4}|$)/gi;
    
    let match;
    while ((match = stillNeededPattern.exec(text)) !== null) {
      const section = match[1];
      
      // Extract course codes and credits from "Still needed" sections
      // Format: "3 Credits in MATH 2641" or "4 Credits in CSC 4320 or 4330"
      const coursePattern = /(\d+)\s+Credits?\s+in\s+([A-Z]{2,4}\s+\d{4}[A-Z]?(?:\s+or\s+\d{4}[A-Z]?)*)/gi;
      
      let courseMatch;
      while ((courseMatch = coursePattern.exec(section)) !== null) {
        const credits = parseInt(courseMatch[1]);
        const courseInfo = courseMatch[2];
        
        // Handle multiple options separated by "or"
        const courseCodes = courseInfo.split(/\s+or\s+/);
        courseCodes.forEach((code, index) => {
          const cleanCode = code.trim();
          if (cleanCode.match(/^[A-Z]{2,4}\s+\d{4}/)) {
            const isAlternative = index > 0;
            const courseTitle = this.getGenericCourseTitle(cleanCode);
            
            courses.push({
              courseCode: cleanCode,
              courseTitle: isAlternative ? `${courseTitle} (Alternative)` : courseTitle,
              credits: credits,
              category: this.getCourseCategory(cleanCode)
            });
          }
        });
      }
    }

    // Also look for named course requirements
    // Format: "Linear Algebra Still needed: 3 Credits in MATH 2641"
    const namedCoursePattern = /([A-Za-z\s&:]+?)\s+Still needed:\s+(\d+)\s+Credits?\s+in\s+([A-Z]{2,4}\s+\d{4}[A-Z]?)/gi;
    
    let namedMatch;
    while ((namedMatch = namedCoursePattern.exec(text)) !== null) {
      const courseTitle = namedMatch[1].trim();
      const credits = parseInt(namedMatch[2]);
      const courseCode = namedMatch[3].trim();
      
      // Avoid duplicates
      if (!courses.find(c => c.courseCode === courseCode)) {
        courses.push({
          courseCode: courseCode,
          courseTitle: courseTitle,
          credits: credits,
          category: this.getCourseCategory(courseCode)
        });
      }
    }

    // Remove duplicates and sort by credits (higher first), then alphabetically
    const uniqueCourses = courses.filter((course, index, self) => 
      index === self.findIndex(c => c.courseCode === course.courseCode)
    );

    return uniqueCourses.sort((a, b) => {
      if (a.credits !== b.credits) {
        return b.credits - a.credits; // Higher credits first
      }
      return a.courseCode.localeCompare(b.courseCode);
    });
  }

  private static extractCoursesFromSection(section: string): RequiredCourse[] {
    const courses: RequiredCourse[] = [];
    
    console.log(`\n--- Extracting courses from section ---`);
    
    // Look for "Still needed:" patterns - more flexible approach
    const stillNeededMatches = section.matchAll(/Still needed:\s*([^]*?)(?=Still needed:|Course Title|Credits required:|[A-Z]{2,4}\s+\d{4}|$)/gi);
    
    for (const match of stillNeededMatches) {
      const neededSection = match[1];
      console.log(`Found "Still needed" section: ${neededSection.substring(0, 100)}...`);
      
      // Extract course codes and credits from "Still needed" sections
      // Format: "3 Credits in MATH 2641" or "4 Credits in CSC 4320 or 4330"
      const coursePattern = /(\d+)\s+Credits?\s+in\s+([A-Z]{2,4}\s+\d{4}[A-Z]?(?:\s+or\s+\d{4}[A-Z]?)*)/gi;
      
      let courseMatch;
      while ((courseMatch = coursePattern.exec(neededSection)) !== null) {
        const credits = parseInt(courseMatch[1]);
        const courseInfo = courseMatch[2];
        
        console.log(`Found course requirement: ${credits} credits in ${courseInfo}`);
        
        // Handle multiple options separated by "or"
        const courseCodes = courseInfo.split(/\s+or\s+/);
        courseCodes.forEach((code, index) => {
          const cleanCode = code.trim();
          if (cleanCode.match(/^[A-Z]{2,4}\s+\d{4}/)) {
            // For alternative courses, mark them as options
            const isAlternative = index > 0;
            const courseTitle = this.getGenericCourseTitle(cleanCode);
            
            const course = {
              courseCode: cleanCode,
              courseTitle: isAlternative ? `${courseTitle} (Alternative)` : courseTitle,
              credits: credits,
              category: this.getCourseCategory(cleanCode)
            };
            
            courses.push(course);
            console.log(`Added course: ${cleanCode}`);
          }
        });
      }
    }
    
    // Also look for specific course mentions with titles before "Still needed"
    // Format: "Linear Algebra Still needed: 3 Credits in MATH 2641"
    const namedCoursePattern = /([A-Za-z\s&:]+?)\s+Still needed:\s+(\d+)\s+Credits?\s+in\s+([A-Z]{2,4}\s+\d{4}[A-Z]?)/gi;
    
    let namedMatch;
    while ((namedMatch = namedCoursePattern.exec(section)) !== null) {
      const courseTitle = namedMatch[1].trim();
      const credits = parseInt(namedMatch[2]);
      const courseCode = namedMatch[3].trim();
      
      // Avoid duplicates
      if (!courses.find(c => c.courseCode === courseCode)) {
        const course = {
          courseCode: courseCode,
          courseTitle: courseTitle,
          credits: credits,
          category: this.getCourseCategory(courseCode)
        };
        
        courses.push(course);
        console.log(`Added named course: ${courseCode} - ${courseTitle}`);
      }
    }
    
    console.log(`Total courses found: ${courses.length}`);
    return courses;
  }

  private static getCourseCategory(courseCode: string): string {
    const prefix = courseCode.split(' ')[0];
    
    if (prefix === 'MATH') {
      return 'Mathematics';
    } else if (prefix === 'ENGL') {
      return 'English';
    } else if (prefix === 'CSC') {
      return 'Computer Science';
    } else if (prefix === 'POLS') {
      return 'Political Science';
    } else if (prefix === 'HON') {
      return 'Honors';
    } else {
      return 'General';
    }
  }

  private static getGenericCourseTitle(courseCode: string): string {
    // Generate generic course titles for codes without explicit titles
    const codeMap: { [key: string]: string } = {
      'MATH 2641': 'Linear Algebra',
      'MATH 3020': 'Applied Probability & Statistics', 
      'CSC 3350': 'Software Development',
      'CSC 4320': 'Operating Systems',
      'CSC 4330': 'Programming Language Concepts',
      'CSC 4520': 'Design & Analysis: Algorithms',
      'CSC 4351': 'Capstone Senior Design I',
      'CSC 4352': 'Capstone Senior Design II',
      'ENGL 1101': 'English Composition I',
      'POLS 1101': 'American Government'
    };
    
    return codeMap[courseCode] || `Course ${courseCode}`;
  }

  private static extractCoursesGeneral(text: string): RequiredCourse[] {
    const courses: RequiredCourse[] = [];
    
    // Look for all "Still needed:" patterns throughout the text
    const stillNeededPattern = /Still needed:[^]*?(?=Still needed:|Course Title|Credits required:|$)/gi;
    const sections = text.match(stillNeededPattern) || [];
    
    sections.forEach(section => {
      // Extract course codes and credits
      const coursePattern = /(\d+)\s+Credits?\s+in\s+([A-Z]{2,4}\s+\d{4}[A-Z]?(?:\s+or\s+\d{4}[A-Z]?)*)/gi;
      
      let match;
      while ((match = coursePattern.exec(section)) !== null) {
        const credits = parseInt(match[1]);
        const courseInfo = match[2];
        
        // Handle multiple options separated by "or"
        const courseCodes = courseInfo.split(/\s+or\s+/);
        courseCodes.forEach(code => {
          const cleanCode = code.trim();
          if (cleanCode.match(/^[A-Z]{2,4}\s+\d{4}/)) {
            courses.push({
              courseCode: cleanCode,
              courseTitle: this.getGenericCourseTitle(cleanCode),
              credits: credits,
              category: "General"
            });
          }
        });
      }
    });
    
    return courses;
  }
}
