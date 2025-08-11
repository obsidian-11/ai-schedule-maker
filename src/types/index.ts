// Academic evaluation data types
export interface RequiredCourse {
  courseCode: string;
  courseTitle: string;
  credits: number;
  category?: string; // e.g., "Core", "Major", "Elective"
}

export interface AcademicEvaluation {
  studentName?: string;
  studentId?: string;
  degreeProgram?: string;
  totalCreditsRequired: number;
  creditsCompleted: number;
  creditsRemaining: number;
  requiredCourses: RequiredCourse[];
  gpa?: number;
  expectedGraduation?: string;
  lastUpdated: Date;
}

// Storage interface for parsed data
export interface StoredEvaluationData {
  evaluation: AcademicEvaluation | null;
  uploadedAt: Date | null;
  fileName: string | null;
}

// PDF parsing result
export interface PDFParseResult {
  success: boolean;
  data?: AcademicEvaluation;
  error?: string;
}

// Course data types (for future phases)
export interface CourseInfo {
  courseCode: string;
  courseTitle: string;
  section: string;
  instructor: string;
  credits: number;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  location: string;
  capacity: number;
  enrolled: number;
  waitlist: number;
}

// User preferences (for future phases)
export interface UserPreferences {
  preferredTimes: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  preferredFormats: {
    inPerson: boolean;
    online: boolean;
    hybrid: boolean;
  };
  blockedTimeSlots: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}
