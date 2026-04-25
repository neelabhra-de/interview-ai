import React, { useState } from 'react';

/**
 * Component for selecting role and difficulty for mock interview
 */
const DifficultySelector = ({ onStart, isLoading, error }) => {
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');

    const handleStart = () => {
        onStart(role, difficulty);
    };

    return (
        <div className="difficulty-selector">
            <div className="difficulty-selector__card">
                <div className="difficulty-selector__header">
                    <h1>Start Mock Interview</h1>
                    <p>Practice with AI-generated questions tailored to your role</p>
                </div>

                <div className="difficulty-selector__form">
                    {/* Role Input */}
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">
                            Job Role / Position
                        </label>
                        <input
                            id="role"
                            type="text"
                            placeholder="e.g., Senior Software Engineer, Product Manager"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isLoading}
                            className="form-input"
                        />
                    </div>

                    {/* Difficulty Selection */}
                    <div className="form-group">
                        <label className="form-label">Difficulty Level</label>
                        <div className="difficulty-options">
                            {['beginner', 'intermediate', 'advanced'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setDifficulty(level)}
                                    disabled={isLoading}
                                    className={`difficulty-option ${
                                        difficulty === level ? 'difficulty-option--active' : ''
                                    }`}
                                >
                                    <span className="difficulty-option__name">
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </span>
                                    <span className="difficulty-option__description">
                                        {level === 'beginner' && 'Entry-level questions'}
                                        {level === 'intermediate' && 'Mid-level questions'}
                                        {level === 'advanced' && 'Complex scenarios & design'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Start Button */}
                    <button
                        type="button"
                        onClick={handleStart}
                        disabled={!role.trim() || isLoading}
                        className="btn-primary"
                    >
                        {isLoading ? 'Starting Interview...' : 'Start Interview'}
                    </button>
                </div>

                <div className="difficulty-selector__info">
                    <p className="info-text">
                        ℹ️ 8 questions • ~15-20 minutes • Real-time AI feedback
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DifficultySelector;
