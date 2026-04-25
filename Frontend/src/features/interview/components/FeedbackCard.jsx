import React from 'react'

/**
 * Component for displaying AI feedback on an answer
 */
const FeedbackCard = ({ feedback, questionNumber, totalQuestions, onNext, isLoading }) => {
    const strengths = feedback?.strengths || []
    const gaps = feedback?.gaps || []

    const getScoreColor = (score) => {
        if (score >= 8) return '#3fb950'
        if (score >= 6) return '#f5a623'
        return '#ff4d4d'
    }

    const getScoreLabel = (score) => {
        if (score >= 8) return 'Excellent'
        if (score >= 6) return 'Good'
        if (score >= 4) return 'Fair'
        return 'Needs Improvement'
    }

    const isLastQuestion = questionNumber === totalQuestions

    return (
        <div className="feedback-card">
            <div className="feedback-header">
                <h2>AI Feedback</h2>
                <p className="question-progress">Question {questionNumber} of {totalQuestions}</p>
            </div>

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

            <div className="feedback-section">
                <h4 className="section-title">Strengths</h4>
                <ul className="feedback-list">
                    {strengths.map((strength, idx) => (
                        <li key={idx} className="feedback-item">{strength}</li>
                    ))}
                    {strengths.length === 0 && <li className="feedback-item">No strengths were returned for this answer.</li>}
                </ul>
            </div>

            <div className="feedback-section">
                <h4 className="section-title">What Is Missing</h4>
                <ul className="feedback-list feedback-list--gaps">
                    {gaps.map((gap, idx) => (
                        <li key={idx} className="feedback-item">{gap}</li>
                    ))}
                    {gaps.length === 0 && <li className="feedback-item">No major gaps were detected.</li>}
                </ul>
            </div>

            <div className="feedback-section">
                <h4 className="section-title">Improved Answer</h4>
                <div className="improved-answer">
                    <p>{feedback.improvedAnswer || 'No improved answer was returned.'}</p>
                </div>
            </div>

            <div className="feedback-actions">
                <button type="button" onClick={onNext} disabled={isLoading} className="btn-next">
                    {isLoading ? 'Loading...' : isLastQuestion ? 'View Summary' : 'Next Question'}
                </button>
            </div>
        </div>
    )
}

export default FeedbackCard
