import { StoredEvaluationData, AcademicEvaluation } from '../types';
export declare class StorageService {
    /**
     * Save academic evaluation data to chrome storage
     */
    static saveEvaluationData(evaluation: AcademicEvaluation, fileName: string): Promise<void>;
    /**
     * Load academic evaluation data from chrome storage
     */
    static loadEvaluationData(): Promise<StoredEvaluationData | null>;
    /**
     * Clear stored evaluation data
     */
    static clearEvaluationData(): Promise<void>;
    /**
     * Check if evaluation data exists
     */
    static hasEvaluationData(): Promise<boolean>;
}
