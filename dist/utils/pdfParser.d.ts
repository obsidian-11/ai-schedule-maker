import { PDFParseResult } from '../types';
export declare class PDFParser {
    /**
     * Parse uploaded PDF file and extract academic evaluation data
     */
    static parseAcademicEvaluation(file: File): Promise<PDFParseResult>;
    /**
     * Parse extracted text to find academic evaluation data
     * This method contains GSU-specific parsing logic
     */
    private static parseEvaluationText;
    private static extractStudentName;
    private static extractStudentId;
    private static extractDegreeProgram;
    private static extractGPA;
    private static extractTotalCredits;
    private static extractCompletedCredits;
    private static extractRemainingCredits;
    private static extractRequiredCourses;
}
