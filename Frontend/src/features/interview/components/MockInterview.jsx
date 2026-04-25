import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import DifficultySelector from './DifficultySelector'
import QuestionDisplay from './QuestionDisplay'
import AnswerInput from './AnswerInput'
import FeedbackCard from './FeedbackCard'
import SessionSummary from './SessionSummary'
import '../style/mock-interview.scss'

/**
 * Main component for mock interview flow
 * Manages setup, interview loop, feedback, and final summary.
 */
const MockInterview = () => {
    const navigate = useNavigate()
    const [ step, setStep ] = useState('setup')
    const [ role, setRole ] = useState('')
    const [ difficulty, setDifficulty ] = useState('intermediate')
    const [ reportId, setReportId ] = useState(null)

    const [ sessionId, setSessionId ] = useState(null)
    const [ currentQuestion, setCurrentQuestion ] = useState(null)
    const [ questionNumber, setQuestionNumber ] = useState(1)
    const [ totalQuestions, setTotalQuestions ] = useState(8)

    const [ userAnswer, setUserAnswer ] = useState('')
    const [ feedback, setFeedback ] = useState(null)
    const [ queuedNextQuestion, setQueuedNextQuestion ] = useState(null)
    const [ summaryReady, setSummaryReady ] = useState(false)
    const [ summaryData, setSummaryData ] = useState(null)

    const [history, setHistory] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState('')

    const {
        reports,
        getReports,
        startMockInterview,
        submitMockAnswer,
        getMockSummary,
        getMockHistory
    } = useInterview({ autoFetch: false })

    useEffect(() => {
        const loadSetupData = async () => {
            const [ historyResult, reportsResult ] = await Promise.allSettled([
                getMockHistory(),
                getReports()
            ])

            if (historyResult.status === 'fulfilled') {
                setHistory(historyResult.value || [])
            }

            if (reportsResult.status === 'rejected' && historyResult.status === 'rejected') {
                setError('Could not load previous sessions. You can still start with a role.')
            }
        }

        loadSetupData()
    }, [ getMockHistory, getReports ])

    const handleStartInterview = useCallback(async ({ role: selectedRole, difficulty: selectedDifficulty, reportId: selectedReportId }) => {
        if (!selectedRole?.trim()) {
            setError('Please enter a role or choose a report.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await startMockInterview({
                role: selectedRole,
                difficulty: selectedDifficulty,
                reportId: selectedReportId || null
            })

            setSessionId(response.session.sessionId)
            setRole(selectedRole)
            setDifficulty(selectedDifficulty)
            setReportId(selectedReportId || null)
            setCurrentQuestion(response.session.question)
            setQuestionNumber(response.session.questionNumber)
            setTotalQuestions(response.session.totalQuestions)

            setUserAnswer('')
            setFeedback(null)
            setQueuedNextQuestion(null)
            setSummaryReady(false)
            setSummaryData(null)
            setStep('interview')
        } catch (err) {
            setError(err.message || 'Failed to start interview')
        } finally {
            setIsLoading(false)
        }
    }, [ startMockInterview ])

    const handleSubmitAnswer = useCallback(async () => {
        if (!userAnswer.trim()) {
            setError('Please enter an answer')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await submitMockAnswer({
                sessionId,
                answer: userAnswer
            })

            setFeedback(response.feedback)
            setQueuedNextQuestion(response.nextQuestion || null)
            setSummaryReady(Boolean(response.summaryReady))
            setUserAnswer('')

            if (response.summaryReady) {
                const summary = await getMockSummary(sessionId)
                setSummaryData(summary)
            }

            setStep('feedback')
        } catch (err) {
            setError(err.message || 'Failed to submit answer')
        } finally {
            setIsLoading(false)
        }
    }, [ sessionId, userAnswer, submitMockAnswer, getMockSummary ])

    const handleNextQuestion = useCallback(() => {
        setError('')
        setFeedback(null)

        if (summaryReady) {
            setStep('summary')
            return
        }

        if (!queuedNextQuestion) {
            setError('Could not load the next question. Please restart the mock interview.')
            return
        }

        setCurrentQuestion(queuedNextQuestion.question)
        setQuestionNumber(queuedNextQuestion.questionNumber)
        setQueuedNextQuestion(null)
        setStep('interview')
    }, [ queuedNextQuestion, summaryReady ])

    const handleRestart = () => {
        setStep('setup')
        setRole('')
        setDifficulty('intermediate')
        setReportId(null)
        setSessionId(null)
        setCurrentQuestion(null)
        setQuestionNumber(1)
        setTotalQuestions(8)

        setUserAnswer('')
        setFeedback(null)
        setQueuedNextQuestion(null)
        setSummaryReady(false)
        setSummaryData(null)
        setError('')
    }

    return (
        <div className="mock-interview">
            <div className="mock-interview__topbar">
                <button type="button" className="topbar-btn" onClick={() => navigate('/interview')}>Back To Home</button>
                {(role || reportId) && (
                    <p className="topbar-meta">
                        {role} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </p>
                )}
            </div>

            {step === 'setup' && (
                <DifficultySelector
                    onStart={handleStartInterview}
                    isLoading={isLoading}
                    error={error}
                    reports={reports}
                    history={history}
                />
            )}

            {step === 'interview' && currentQuestion && (
                <div className="mock-interview__container">
                    <div className="mock-interview__progress">
                        <div className="progress-bar">
                            <div
                                className="progress-bar__fill"
                                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                            />
                        </div>
                        <p className="progress-bar__text">Question {questionNumber} of {totalQuestions}</p>
                    </div>

                    <QuestionDisplay
                        question={currentQuestion}
                        questionNumber={questionNumber}
                        totalQuestions={totalQuestions}
                        role={role}
                        difficulty={difficulty}
                    />

                    <AnswerInput
                        value={userAnswer}
                        onChange={(value) => setUserAnswer(value)}
                        onSubmit={handleSubmitAnswer}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            )}

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

            {step === 'summary' && summaryData && (
                <SessionSummary data={summaryData} onRestart={handleRestart} />
            )}
        </div>
    )
}

export default MockInterview
