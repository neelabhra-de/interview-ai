import React from 'react'

/**
 * Component for user to input their answer
 */
const AnswerInput = ({ value, onChange, onSubmit, isLoading, error }) => {
    const trimmed = value.trim()
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0
    const minWords = 10
    const isValid = wordCount >= minWords

    return (
        <div className="answer-input">
            <div className="answer-input__header">
                <label htmlFor="answer" className="answer-label">Your Answer</label>
                <span className="word-count" style={{ color: wordCount < minWords ? '#ff2d78' : '#3fb950' }}>
                    {wordCount} words
                </span>
            </div>

            <textarea
                id="answer"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Type your answer here... (Minimum 10 words)"
                disabled={isLoading}
                className="answer-textarea"
                rows="6"
            />

            {error && <div className="error-message">{error}</div>}

            <div className="answer-input__footer">
                <p className="hint-text">
                    Tip: include a short structure, then a concrete example from experience.
                </p>

                <button type="button" onClick={onSubmit} disabled={!isValid || isLoading} className="btn-submit">
                    {isLoading ? 'Analyzing...' : 'Submit Answer and Get Feedback'}
                </button>
            </div>
        </div>
    )
}

export default AnswerInput
