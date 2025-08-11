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
   * This method contains GSU-specific parsing logic
   */
  private static parseEvaluationText(text: string): AcademicEvaluation {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Initialize evaluation object with defaults
    const evaluation: AcademicEvaluation = {
      totalCreditsRequired: 0,
      creditsCompleted: 0,
      creditsRemaining: 0,
      requiredCourses: [],
      lastUpdated: new Date()
    };

    // Parse student information
    evaluation.studentName = this.extractStudentName(text);
    evaluation.studentId = this.extractStudentId(text);
    evaluation.degreeProgram = this.extractDegreeProgram(text);
    evaluation.gpa = this.extractGPA(text);

    // Parse credit information
    evaluation.totalCreditsRequired = this.extractTotalCredits(text);
    evaluation.creditsCompleted = this.extractCompletedCredits(text);
    evaluation.creditsRemaining = this.extractRemainingCredits(text);

    // Parse required courses
    evaluation.requiredCourses = this.extractRequiredCourses(text);

    // Calculate remaining credits if not found
    if (evaluation.creditsRemaining === 0 && evaluation.totalCreditsRequired > 0) {
      evaluation.creditsRemaining = evaluation.totalCreditsRequired - evaluation.creditsCompleted;
    }

    return evaluation;
  }

  private static extractStudentName(text: string): string | undefined {
    const namePattern = /(?:Student Name|Name)[:\s]+([A-Za-z\s,]+)/i;
    const match = text.match(namePattern);
    return match ? match[1].trim() : undefined;
  }

  private static extractStudentId(text: string): string | undefined {
    const idPattern = /(?:Student ID|ID)[:\s]+(\d+)/i;
    const match = text.match(idPattern);
    return match ? match[1] : undefined;
  }

  private static extractDegreeProgram(text: string): string | undefined {
    const programPattern = /(?:Program|Degree|Major)[:\s]+([A-Za-z\s&,-]+)/i;
    const match = text.match(programPattern);
    return match ? match[1].trim() : undefined;
  }

  private static extractGPA(text: string): number | undefined {
    const gpaPattern = /(?:GPA|Grade Point Average)[:\s]+(\d+\.?\d*)/i;
    const match = text.match(gpaPattern);
    return match ? parseFloat(match[1]) : undefined;
  }

  private static extractTotalCredits(text: string): number {
    const patterns = [
      /(?:Total Credits? Required|Credits? Required)[:\s]+(\d+)/i,
      /(?:Program Hours|Total Hours)[:\s]+(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  private static extractCompletedCredits(text: string): number {
    const patterns = [
      /(?:Credits? Completed|Completed Credits?)[:\s]+(\d+)/i,
      /(?:Hours Completed|Completed Hours)[:\s]+(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  private static extractRemainingCredits(text: string): number {
    const patterns = [
      /(?:Credits? Remaining|Remaining Credits?)[:\s]+(\d+)/i,
      /(?:Hours Remaining|Remaining Hours)[:\s]+(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  private static extractRequiredCourses(text: string): RequiredCourse[] {
    const courses: RequiredCourse[] = [];
    
    // Common course code patterns for GSU
    const coursePattern = /([A-Z]{2,4}\s?\d{4})\s+([A-Za-z\s&,-]+?)(?:\s+(\d+)\s*(?:credit|hour|cr|hr)s?)?/gi;
    
    let match;
    while ((match = coursePattern.exec(text)) !== null) {
      const courseCode = match[1].replace(/\s+/g, ' ').trim();
      const courseTitle = match[2].trim();
      const credits = match[3] ? parseInt(match[3]) : 3; // Default to 3 credits
      
      // Skip if course code is too generic or title too short
      if (courseCode.length >= 6 && courseTitle.length >= 5) {
        courses.push({
          courseCode,
          courseTitle,
          credits
        });
      }
    }

    // Remove duplicates based on course code
    const uniqueCourses = courses.filter((course, index, self) => 
      index === self.findIndex(c => c.courseCode === course.courseCode)
    );

    return uniqueCourses;
  }
}
