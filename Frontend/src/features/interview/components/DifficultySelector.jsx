import React, { useMemo, useState } from 'react'

const DIFFICULTY_LEVELS = [ 'beginner', 'intermediate', 'advanced' ]

/**
 * Component for selecting role and difficulty for mock interview
 */
const DifficultySelector = ({ onStart, isLoading, error, reports = [], history = [] }) => {
    const [setupMode, setSetupMode] = useState('role')
    const [role, setRole] = useState('')
    const [difficulty, setDifficulty] = useState('intermediate')
    const [selectedReportId, setSelectedReportId] = useState('')

    const selectedReport = useMemo(
        () => reports.find((report) => report._id === selectedReportId) || null,
        [ reports, selectedReportId ]
    )

    const resolvedRole = setupMode === 'role'
        ? role.trim()
        : (selectedReport?.title || role).trim()

    const canStart = Boolean(resolvedRole) && !isLoading && (setupMode === 'role' || selectedReportId)

    const handleStart = () => {
        if (!canStart) return

        onStart({
            role: resolvedRole,
            difficulty,
            reportId: setupMode === 'report' ? selectedReportId : null
        })
    }

    return (
        <div className="difficulty-selector">
            <div className="difficulty-selector__card">
                <div className="difficulty-selector__header">
                    <h1>Mock Interview</h1>
                    <p>Practice one question at a time and get instant AI feedback.</p>
                </div>

                <div className="difficulty-selector__form">
                    <div className="form-group">
                        <label className="form-label">Interview Source</label>
                        <div className="setup-modes">
                            <button
                                type="button"
                                onClick={() => setSetupMode('role')}
                                disabled={isLoading}
                                className={`setup-mode-btn ${setupMode === 'role' ? 'setup-mode-btn--active' : ''}`}
                            >
                                Start With Role
                            </button>
                            <button
                                type="button"
                                onClick={() => setSetupMode('report')}
                                disabled={isLoading || reports.length === 0}
                                className={`setup-mode-btn ${setupMode === 'report' ? 'setup-mode-btn--active' : ''}`}
                            >
                                Reuse Previous Report
                            </button>
                        </div>
                    </div>

                    {setupMode === 'role' && (
                        <div className="form-group">
                            <label htmlFor="role" className="form-label">Job Role / Position</label>
                            <input
                                id="role"
                                type="text"
                                placeholder="e.g., Senior Software Engineer"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>
                    )}

                    {setupMode === 'report' && (
                        <div className="form-group">
                            <label htmlFor="report" className="form-label">Choose Previous Report</label>
                            <select
                                id="report"
                                value={selectedReportId}
                                onChange={(event) => setSelectedReportId(event.target.value)}
                                disabled={isLoading || reports.length === 0}
                                className="form-input form-input--select"
                            >
                                <option value="">Select a report</option>
                                {reports.map((report) => (
                                    <option key={report._id} value={report._id}>
                                        {report.title || 'Untitled role'} - {new Date(report.createdAt).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                            {selectedReport && (
                                <p className="setup-helper">Role will be set as: {selectedReport.title || 'Untitled role'}</p>
                            )}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Difficulty Level</label>
                        <div className="difficulty-options">
                            {DIFFICULTY_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setDifficulty(level)}
                                    disabled={isLoading}
                                    className={`difficulty-option ${difficulty === level ? 'difficulty-option--active' : ''}`}
                                >
                                    <span className="difficulty-option__name">
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </span>
                                    <span className="difficulty-option__description">
                                        {level === 'beginner' && 'Entry-level questions'}
                                        {level === 'intermediate' && 'Mid-level questions'}
                                        {level === 'advanced' && 'Complex scenarios and design'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="button" onClick={handleStart} disabled={!canStart} className="btn-primary">
                        {isLoading ? 'Starting Interview...' : 'Start Interview'}
                    </button>
                </div>

                <div className="difficulty-selector__info">
                    <p className="info-text">8 questions - 15 to 20 minutes - real-time AI feedback</p>
                    {history.length > 0 && (
                        <p className="info-text">Recent sessions: {history.length} completed or in progress</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DifficultySelector
