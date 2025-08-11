import { StoredEvaluationData, AcademicEvaluation } from '../types';

const STORAGE_KEYS = {
  EVALUATION_DATA: 'evaluationData'
} as const;

export class StorageService {
  /**
   * Save academic evaluation data to chrome storage
   */
  static async saveEvaluationData(
    evaluation: AcademicEvaluation,
    fileName: string
  ): Promise<void> {
    const data: StoredEvaluationData = {
      evaluation,
      uploadedAt: new Date(),
      fileName
    };

    await chrome.storage.local.set({
      [STORAGE_KEYS.EVALUATION_DATA]: data
    });
  }

  /**
   * Load academic evaluation data from chrome storage
   */
  static async loadEvaluationData(): Promise<StoredEvaluationData | null> {
    const result = await chrome.storage.local.get([STORAGE_KEYS.EVALUATION_DATA]);
    const data = result[STORAGE_KEYS.EVALUATION_DATA];
    
    if (!data) {
      return null;
    }

    // Convert date strings back to Date objects
    return {
      ...data,
      uploadedAt: data.uploadedAt ? new Date(data.uploadedAt) : null,
      evaluation: data.evaluation ? {
        ...data.evaluation,
        lastUpdated: new Date(data.evaluation.lastUpdated)
      } : null
    };
  }

  /**
   * Clear stored evaluation data
   */
  static async clearEvaluationData(): Promise<void> {
    await chrome.storage.local.remove([STORAGE_KEYS.EVALUATION_DATA]);
  }

  /**
   * Check if evaluation data exists
   */
  static async hasEvaluationData(): Promise<boolean> {
    const data = await this.loadEvaluationData();
    return data?.evaluation !== null;
  }
}
