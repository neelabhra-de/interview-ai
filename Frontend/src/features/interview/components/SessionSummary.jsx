import React from 'react'
import { useNavigate } from 'react-router'

/**
 * Component for displaying final mock interview summary
 */
const SessionSummary = ({ data, onRestart }) => {
    const navigate = useNavigate()
    const summary = data

    const getPerformanceLevel = (score) => {
        if (score >= 8) return { level: 'Excellent', color: '#3fb950' }
        if (score >= 7) return { level: 'Very Good', color: '#4a90e2' }
        if (score >= 6) return { level: 'Good', color: '#f5a623' }
        if (score >= 4) return { level: 'Fair', color: '#ff9500' }
        return { level: 'Needs Work', color: '#ff4d4d' }
    }

    const performance = getPerformanceLevel(summary.overallScore)

    const formatTime = (seconds = 0) => {
        const minutes = Math.max(1, Math.floor(seconds / 60))
        return `${minutes} min`
    }

    return (
        <div className="session-summary">
            <div className="summary-container">
                <div className="summary-header">
                    <h1>Interview Complete</h1>
                    <p className="summary-subtitle">Here is your performance summary</p>
                </div>

                <div className="overall-score">
                    <div className="score-display">
                        <div className="score-box">
                            <span className="score-number" style={{ color: performance.color }}>
                                {summary.overallScore}
                            </span>
                            <span className="score-denominator">/ 10</span>
                        </div>
                    </div>
                    <p className="score-level" style={{ color: performance.color }}>{performance.level}</p>
                </div>

                <div className="summary-stats">
                    <div className="stat-card">
                        <span className="stat-label">Questions Answered</span>
                        <span className="stat-value">{summary.totalQuestions}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Time Spent</span>
                        <span className="stat-value">{formatTime(summary.totalTimeSpent)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Difficulty</span>
                        <span className="stat-value capitalize">{summary.difficulty}</span>
                    </div>
                </div>

                <div className="summary-section">
                    <h3 className="section-heading">Weak Areas</h3>
                    <div className="areas-grid">
                        {(summary.weakAreas || []).map((area, idx) => (
                            <div key={idx} className="area-tag">{area}</div>
                        ))}
                    </div>
                </div>

                <div className="summary-section">
                    <h3 className="section-heading">Improvement Tips</h3>
                    <ol className="tips-list">
                        {(summary.improvementTips || []).map((tip, idx) => (
                            <li key={idx} className="tip-item">{tip}</li>
                        ))}
                    </ol>
                </div>

                <div className="summary-section">
                    <h3 className="section-heading">Question Breakdown</h3>
                    <div className="questions-breakdown">
                        {(summary.questionsDetail || []).map((q, idx) => (
                            <div key={idx} className="question-score-item">
                                <div className="question-info">
                                    <p className="question-number">Q{q.questionNumber}</p>
                                    <p className="question-text">{q.question.substring(0, 60)}...</p>
                                </div>
                                <div className="score-badge" style={{
                                    backgroundColor: q.score >= 7 ? '#3fb95020' : q.score >= 5 ? '#f5a62320' : '#ff4d4d20'
                                }}>
                                    <span style={{
                                        color: q.score >= 7 ? '#3fb950' : q.score >= 5 ? '#f5a623' : '#ff4d4d'
                                    }}>
                                        {q.score}/10
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="summary-actions">
                    <button type="button" onClick={onRestart} className="btn-restart">Start Another Interview</button>
                    <button type="button" onClick={() => navigate('/interview')} className="btn-home">Back to Home</button>
                </div>
            </div>
        </div>
    )
}

export default SessionSummary
