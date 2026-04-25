import React from 'react';

/**
 * Component for displaying AI feedback on an answer
 */
const FeedbackCard = ({ feedback, questionNumber, totalQuestions, onNext, isLoading }) => {
    const getScoreColor = (score) => {
        if (score >= 8) return '#3fb950'; // green
        if (score >= 6) return '#f5a623'; // orange
        return '#ff4d4d'; // red
    };

    const getScoreLabel = (score) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Fair';
        return 'Needs Improvement';
    };

    const isLastQuestion = questionNumber === totalQuestions;

    return (
        <div className="feedback-card">
            <div className="feedback-header">
                <h2>AI Feedback</h2>
                <p className="question-progress">
                    Question {questionNumber} of {totalQuestions}
                </p>
            </div>

            {/* Score */}
            <div className="feedback-score-section">
                <div className="score-badge" style={{ borderColor: getScoreColor(feedback.score) }}>
                    <span className="score-value" style={{ color: getScoreColor(feedback.score) }}>
                        {feedback.score}
                    </span>
                    <span className="score-label">/ 10</span>
                </div>
                <p className="score-assessment" style={{ color: getScoreColor(feedback.score) }}>
                    {getScoreLabel(feedback.score)}
                </p>
            </div>

            {/* Strengths */}
            <div className="feedback-section">
                <h4 className="section-title">✅ Strengths</h4>
                <ul className="feedback-list">
                    {feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="feedback-item">
                            {strength}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gaps */}
            <div className="feedback-section">
                <h4 className="section-title">🔍 Areas for Improvement</h4>
                <ul className="feedback-list feedback-list--gaps">
                    {feedback.gaps.map((gap, idx) => (
                        <li key={idx} className="feedback-item">
                            {gap}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Improved Answer */}
            <div className="feedback-section">
                <h4 className="section-title">💡 Improved Answer</h4>
                <div className="improved-answer">
                    <p>{feedback.improvedAnswer}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="feedback-actions">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isLoading}
                    className="btn-next"
                >
                    {isLoading ? 'Loading...' : isLastQuestion ? 'View Summary' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default FeedbackCard;
