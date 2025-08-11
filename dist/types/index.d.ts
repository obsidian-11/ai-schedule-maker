export interface RequiredCourse {
    courseCode: string;
    courseTitle: string;
    credits: number;
    category?: string;
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
export interface StoredEvaluationData {
    evaluation: AcademicEvaluation | null;
    uploadedAt: Date | null;
    fileName: string | null;
}
export interface PDFParseResult {
    success: boolean;
    data?: AcademicEvaluation;
    error?: string;
}
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
