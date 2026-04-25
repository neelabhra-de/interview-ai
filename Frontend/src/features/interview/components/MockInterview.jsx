import React, { useState, useCallback } from 'react';
import { useInterview } from '../hooks/useInterview';
import DifficultySelector from './DifficultySelector';
import QuestionDisplay from './QuestionDisplay';
import AnswerInput from './AnswerInput';
import FeedbackCard from './FeedbackCard';
import SessionSummary from './SessionSummary';
import './mock-interview.scss';

/**
 * Main component for mock interview flow
 * Manages the entire interview lifecycle from setup to completion
 */
const MockInterview = () => {
    // Local state for component flow
    const [step, setStep] = useState('difficulty'); // difficulty | interview | feedback | summary
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(8);
    const [questionsRemaining, setQuestionsRemaining] = useState(8);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [allFeedback, setAllFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summaryData, setSummaryData] = useState(null);

    // Use custom hook for API calls
    const {
        startMockInterview,
        submitMockAnswer,
        getMockSummary,
        getMockHistory
    } = useInterview();

    /**
     * Handle starting a new mock interview
     */
    const handleStartInterview = useCallback(async (selectedRole, selectedDifficulty) => {
        if (!selectedRole.trim()) {
            setError('Please enter a role');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await startMockInterview({
                role: selectedRole,
                difficulty: selectedDifficulty
            });

            setSessionId(response.session.sessionId);
            setRole(selectedRole);
            setDifficulty(selectedDifficulty);
            setCurrentQuestion(response.session.question);
            setQuestionNumber(response.session.questionNumber);
            setTotalQuestions(response.session.totalQuestions);
            setQuestionsRemaining(response.session.totalQuestions - 1);
            setStep('interview');
            setUserAnswer('');
            setAllFeedback([]);
        } catch (err) {
            setError(err.message || 'Failed to start interview');
        } finally {
            setIsLoading(false);
        }
    }, [startMockInterview]);

    /**
     * Handle submitting an answer
     */
    const handleSubmitAnswer = useCallback(async () => {
        if (!userAnswer.trim()) {
            setError('Please enter an answer');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await submitMockAnswer({
                sessionId,
                answer: userAnswer
            });

            // Store feedback for this question
            const newFeedback = {
                questionNumber,
                question: currentQuestion,
                userAnswer,
                ...response.feedback
            };
            setAllFeedback([...allFeedback, newFeedback]);

            // Display feedback
            setFeedback(response.feedback);
            setQuestionsRemaining(response.questionsRemaining);
            setStep('feedback');
            setUserAnswer('');

        } catch (err) {
            setError(err.message || 'Failed to submit answer');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, userAnswer, currentQuestion, questionNumber, allFeedback, submitMockAnswer]);

    /**
     * Handle moving to next question
     */
    const handleNextQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await submitMockAnswer({
                sessionId,
                answer: userAnswer || 'Skipped'
            });

            // Store feedback for this question
            const newFeedback = {
                questionNumber,
                question: currentQuestion,
                userAnswer: userAnswer || 'Skipped',
                ...response.feedback
            };
            setAllFeedback([...allFeedback, newFeedback]);

            if (response.summaryReady) {
                // Get final summary
                const summary = await getMockSummary(sessionId);
                setSummaryData(summary);
                setStep('summary');
            } else {
                // Show next question
                setCurrentQuestion(response.nextQuestion.question);
                setQuestionNumber(response.nextQuestion.questionNumber);
                setFeedback(null);
                setStep('interview');
                setUserAnswer('');
            }

        } catch (err) {
            setError(err.message || 'Failed to continue interview');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, userAnswer, currentQuestion, questionNumber, allFeedback, submitMockAnswer, getMockSummary]);

    /**
     * Handle going back to start
     */
    const handleRestart = () => {
        setStep('difficulty');
        setRole('');
        setSessionId(null);
        setCurrentQuestion(null);
        setUserAnswer('');
        setFeedback(null);
        setAllFeedback([]);
        setSummaryData(null);
        setError(null);
    };

    return (
        <div className="mock-interview">
            {/* Difficulty Selection Step */}
            {step === 'difficulty' && (
                <DifficultySelector
                    onStart={handleStartInterview}
                    isLoading={isLoading}
                    error={error}
                />
            )}

            {/* Interview Step */}
            {step === 'interview' && currentQuestion && (
                <div className="mock-interview__container">
                    {/* Progress Bar */}
                    <div className="mock-interview__progress">
                        <div className="progress-bar">
                            <div
                                className="progress-bar__fill"
                                style={{
                                    width: `${((questionNumber) / totalQuestions) * 100}%`
                                }}
                            />
                        </div>
                        <p className="progress-bar__text">
                            Question {questionNumber} of {totalQuestions}
                        </p>
                    </div>

                    {/* Question Display */}
                    <QuestionDisplay
                        question={currentQuestion}
                        questionNumber={questionNumber}
                        totalQuestions={totalQuestions}
                        role={role}
                        difficulty={difficulty}
                    />

                    {/* Answer Input */}
                    <AnswerInput
                        value={userAnswer}
                        onChange={(value) => setUserAnswer(value)}
                        onSubmit={handleSubmitAnswer}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            )}

            {/* Feedback Step */}
            {step === 'feedback' && feedback && (
                <div className="mock-interview__container">
                    <FeedbackCard
                        feedback={feedback}
                        questionNumber={questionNumber}
                        totalQuestions={totalQuestions}
                        onNext={handleNextQuestion}
                        isLoading={isLoading}
                    />
                </div>
            )}

            {/* Summary Step */}
            {step === 'summary' && summaryData && (
                <SessionSummary
                    data={summaryData}
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
};

export default MockInterview;
