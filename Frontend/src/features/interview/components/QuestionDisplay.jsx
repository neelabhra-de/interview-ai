import React from 'react';

/**
 * Component for displaying a mock interview question
 */
const QuestionDisplay = ({ 
    question, 
    questionNumber, 
    totalQuestions, 
    role, 
    difficulty 
}) => {
    return (
        <div className="question-display">
            <div className="question-display__header">
                <div className="question-meta">
                    <h3 className="role-difficulty">
                        <span className="role">{role}</span>
                        <span className="bullet">•</span>
                        <span className={`difficulty difficulty--${difficulty}`}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                    </h3>
                </div>
            </div>

            <div className="question-display__content">
                <h2 className="question-text">{question}</h2>
                <div className="question-display__hint">
                    <p>📝 Take your time and provide a detailed answer. AI will evaluate your response.</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionDisplay;
