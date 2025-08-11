import React, { useState, useEffect } from 'react';
import { AcademicEvaluation, StoredEvaluationData, RequiredCourse } from '../types';
import { StorageService } from '../utils/storage';
import { PDFParser } from '../utils/pdfParser';
import './popup.css';

const Popup: React.FC = () => {
  const [evaluationData, setEvaluationData] = useState<StoredEvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load existing data on component mount
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    setIsLoading(true);
    try {
      const data = await StorageService.loadEvaluationData();
      setEvaluationData(data);
    } catch (err) {
      setError('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const parseResult = await PDFParser.parseAcademicEvaluation(file);
      
      if (parseResult.success && parseResult.data) {
        await StorageService.saveEvaluationData(parseResult.data, file.name);
        const updatedData = await StorageService.loadEvaluationData();
        setEvaluationData(updatedData);
      } else {
        setError(parseResult.error || 'Failed to parse PDF');
      }
    } catch (err) {
      setError('Error processing PDF file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      await StorageService.clearEvaluationData();
      setEvaluationData(null);
      setError(null);
    } catch (err) {
      setError('Failed to reset data');
    }
  };

  const renderEvaluationSummary = (evaluation: AcademicEvaluation) => (
    <div className="evaluation-summary">
      <h3>Academic Evaluation Summary</h3>
      
      {evaluation.studentName && (
        <div className="info-row">
          <span className="label">Student:</span>
          <span className="value">{evaluation.studentName}</span>
        </div>
      )}
      
      {evaluation.degreeProgram && (
        <div className="info-row">
          <span className="label">Program:</span>
          <span className="value">{evaluation.degreeProgram}</span>
        </div>
      )}

      <div className="credits-section">
        <h4>Credit Summary</h4>
        <div className="info-row">
          <span className="label">Total Required:</span>
          <span className="value">{evaluation.totalCreditsRequired} credits</span>
        </div>
        <div className="info-row">
          <span className="label">Completed:</span>
          <span className="value">{evaluation.creditsCompleted} credits</span>
        </div>
        <div className="info-row highlight">
          <span className="label">Remaining:</span>
          <span className="value">{evaluation.creditsRemaining} credits</span>
        </div>
        
        {evaluation.gpa && (
          <div className="info-row">
            <span className="label">GPA:</span>
            <span className="value">{evaluation.gpa.toFixed(2)}</span>
          </div>
        )}
      </div>

      {evaluation.requiredCourses.length > 0 && (
        <div className="courses-section">
          <h4>Required Courses ({evaluation.requiredCourses.length})</h4>
          <div className="courses-list">
            {renderCoursesList(evaluation.requiredCourses)}
          </div>
        </div>
      )}
    </div>
  );

  const renderCoursesList = (courses: RequiredCourse[]) => {
    // Sort courses by credits (higher first), then alphabetically by code
    const sortedCourses = [...courses].sort((a, b) => {
      if (a.credits !== b.credits) {
        return b.credits - a.credits; // Higher credits first
      }
      return a.courseCode.localeCompare(b.courseCode);
    });

    return sortedCourses.map((course, index) => (
      <div key={index} className="course-item">
        <span className="course-code">{course.courseCode}</span>
        <span className="course-title">{course.courseTitle}</span>
        <span className="course-credits">{course.credits} cr</span>
        {course.category && (
          <span className="course-category">{course.category}</span>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>GSU Schedule Assistant</h1>
        <p>Upload your academic evaluation to get started</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!evaluationData?.evaluation ? (
        <div className="upload-section">
          <div className="upload-area">
            <div className="upload-icon">📄</div>
            <h3>Upload Academic Evaluation PDF</h3>
            <p>Select your GSU academic evaluation PDF to extract course requirements and progress information.</p>
            
            <label className="upload-button">
              {isUploading ? 'Processing...' : 'Choose PDF File'}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="content-section">
          {renderEvaluationSummary(evaluationData.evaluation)}
          
          <div className="actions">
            <div className="file-info">
              <small>
                Uploaded: {evaluationData.fileName} 
                {evaluationData.uploadedAt && (
                  <span> on {evaluationData.uploadedAt.toLocaleDateString()}</span>
                )}
              </small>
            </div>
            
            <div className="action-buttons">
              <label className="button secondary">
                Re-upload PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
              </label>
              
              <button 
                className="button danger" 
                onClick={handleReset}
                disabled={isUploading}
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="popup-footer">
        <p>Next: Visit GSU course registration to continue</p>
      </footer>
    </div>
  );
};

export default Popup;
