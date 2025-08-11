import { PDFParseResult } from '../types';
export declare class PDFParser {
    /**
     * Parse uploaded PDF file and extract academic evaluation data
     */
    static parseAcademicEvaluation(file: File): Promise<PDFParseResult>;
    /**
     * Parse extracted text to find academic evaluation data
     * This method contains GSU-specific parsing logic for real GSU evaluations
     */
    private static parseEvaluationText;
    private static extractGSUStudentName;
    private static extractGSUStudentId;
    private static extractGSUDegreeProgram;
    private static extractGSUGPA;
    private static extractGSUCreditInfo;
    private static extractGSURequiredCourses;
    private static extractCoursesFromSection;
    private static getCourseCategory;
    private static getGenericCourseTitle;
    private static extractCoursesGeneral;
}
