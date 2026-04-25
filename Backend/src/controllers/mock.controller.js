const mockInterviewModel = require('../models/mockInterview.model')
const mockQuestionModel = require('../models/mockQuestion.model')
const interviewReportModel = require('../models/interviewReport.model')
const {
    generateMockQuestion,
    generateAnswerFeedback,
    generateMockInterviewSummary
} = require('../services/ai.service')

const TOTAL_QUESTIONS = 8

const normalizeQuestion = (value = '') => value.trim().toLowerCase()

function getReportQuestionPool(report) {
    if (!report) return []

    const technical = (report.technicalQuestions || []).map((item) => ({
        question: item.question,
        category: 'technical',
        source: 'report'
    }))

    const behavioral = (report.behavioralQuestions || []).map((item) => ({
        question: item.question,
        category: 'behavioral',
        source: 'report'
    }))

    return [ ...technical, ...behavioral ].filter((item) => item.question)
}

function pickUnusedReportQuestion(report, previousQuestions = []) {
    const asked = new Set(previousQuestions.map(normalizeQuestion))
    const candidates = getReportQuestionPool(report).filter((item) => !asked.has(normalizeQuestion(item.question)))

    if (candidates.length === 0) {
        return null
    }

    const randomIndex = Math.floor(Math.random() * candidates.length)
    return candidates[randomIndex]
}

function getFallbackQuestion({ role, difficulty, category }) {
    const levelHint = difficulty === 'advanced'
        ? 'Include trade-offs and scaling concerns.'
        : difficulty === 'beginner'
            ? 'Keep it clear and focused on fundamentals.'
            : 'Include practical examples from work.'

    const templates = {
        technical: `For a ${role} role, explain how you would approach a challenging technical problem from start to finish. ${levelHint}`,
        behavioral: `Tell me about a time you handled a difficult team situation as a ${role}. What did you do and what was the outcome? ${levelHint}`,
        'system-design': `Design a reliable, scalable service relevant to a ${role} role. Explain components, bottlenecks, and trade-offs. ${levelHint}`
    }

    return templates[category] || templates.technical
}

async function createNextQuestion({ session, previousQuestions, report }) {
    const fromReport = pickUnusedReportQuestion(report, previousQuestions)

    if (fromReport) {
        return fromReport
    }

    const categories = [ 'technical', 'behavioral' ]
    if (session.difficulty === 'advanced') {
        categories.push('system-design')
    }

    const randomCategory = categories[Math.floor(Math.random() * categories.length)]

    try {
        const generated = await generateMockQuestion({
            role: session.role,
            difficulty: session.difficulty,
            category: randomCategory,
            previousQuestions
        })

        return {
            question: generated.question,
            category: generated.category,
            source: 'fresh'
        }
    } catch (error) {
        console.error('AI question generation failed, using fallback question:', error.message)
        return {
            question: getFallbackQuestion({
                role: session.role,
                difficulty: session.difficulty,
                category: randomCategory
            }),
            category: randomCategory,
            source: 'fresh'
        }
    }
}

/**
 * Start a new mock interview session
 * POST /api/interview/mock/start
 */
async function startMockInterviewController(req, res) {
    try {
        const { role = '', difficulty = 'intermediate', reportId } = req.body
        const userId = req.user.id

        if (![ 'beginner', 'intermediate', 'advanced' ].includes(difficulty)) {
            return res.status(400).json({ message: 'Difficulty must be beginner, intermediate, or advanced' })
        }

        let selectedReport = null

        if (reportId) {
            selectedReport = await interviewReportModel.findOne({ _id: reportId, user: userId })

            if (!selectedReport) {
                return res.status(404).json({ message: 'Selected report not found' })
            }
        }

        const resolvedRole = role.trim() || selectedReport?.title || ''

        if (!resolvedRole) {
            return res.status(400).json({ message: 'Role is required' })
        }

        const mockSession = await mockInterviewModel.create({
            user: userId,
            role: resolvedRole,
            difficulty,
            reportId: selectedReport?._id || null,
            status: 'in-progress',
            questions: [],
            currentQuestionIndex: 0
        })

        const firstQuestionData = await createNextQuestion({
            session: mockSession,
            previousQuestions: [],
            report: selectedReport
        })

        const firstQuestion = await mockQuestionModel.create({
            session: mockSession._id,
            questionNumber: 1,
            question: firstQuestionData.question,
            category: firstQuestionData.category,
            source: firstQuestionData.source
        })

        mockSession.questions.push(firstQuestion._id)
        await mockSession.save()

        res.status(201).json({
            message: 'Mock interview started successfully',
            session: {
                sessionId: mockSession._id,
                question: firstQuestion.question,
                questionSource: firstQuestion.source,
                questionNumber: 1,
                totalQuestions: TOTAL_QUESTIONS,
                difficulty: mockSession.difficulty,
                role: mockSession.role
            }
        })
    } catch (error) {
        console.error('Error starting mock interview:', error)
        res.status(500).json({
            message: 'Error starting mock interview',
            error: error.message
        })
    }
}

/**
 * Submit an answer to a mock interview question and get feedback
 * POST /api/interview/mock/answer
 */
async function submitAnswerController(req, res) {
    try {
        const { sessionId, answer } = req.body
        const userId = req.user.id

        if (!sessionId || !answer || !answer.trim()) {
            return res.status(400).json({ message: 'Session ID and answer are required' })
        }

        const session = await mockInterviewModel.findOne({ _id: sessionId, user: userId }).populate({
            path: 'questions',
            model: 'mockQuestions'
        })

        if (!session) {
            return res.status(404).json({ message: 'Mock interview session not found' })
        }

        if (session.status !== 'in-progress') {
            return res.status(400).json({ message: 'This mock interview session is already completed' })
        }

        const currentQuestion = session.questions[session.currentQuestionIndex]

        if (!currentQuestion) {
            return res.status(400).json({ message: 'Invalid question index' })
        }

        currentQuestion.userAnswer = answer
        currentQuestion.answeredAt = new Date()

        const feedback = await generateAnswerFeedback({
            question: currentQuestion.question,
            userAnswer: answer,
            role: session.role,
            difficulty: session.difficulty
        })

        currentQuestion.feedback = {
            score: feedback.score,
            strengths: feedback.strengths,
            gaps: feedback.gaps,
            improvedAnswer: feedback.improvedAnswer,
            generatedAt: new Date()
        }

        await currentQuestion.save()

        const answeredCount = session.currentQuestionIndex + 1
        const questionsRemaining = Math.max(0, TOTAL_QUESTIONS - answeredCount)

        const response = {
            message: 'Answer submitted successfully',
            feedback: {
                score: feedback.score,
                strengths: feedback.strengths,
                gaps: feedback.gaps,
                improvedAnswer: feedback.improvedAnswer
            },
            questionNumber: answeredCount,
            questionsRemaining
        }

        if (answeredCount >= TOTAL_QUESTIONS) {
            session.status = 'completed'
            session.completedAt = new Date()

            const allQuestions = await mockQuestionModel
                .find({ session: sessionId })
                .sort({ questionNumber: 1 })

            const scores = allQuestions.map((item) => item.feedback?.score || 0)
            const overallScore = Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1))

            session.overallScore = overallScore

            const summary = await generateMockInterviewSummary({
                questions: allQuestions.map((item) => ({
                    question: item.question,
                    userAnswer: item.userAnswer,
                    feedback: item.feedback
                })),
                role: session.role
            })

            session.weakAreas = summary.weakAreas || []
            session.improvementTips = summary.improvementTips || []

            await session.save()

            response.summaryReady = true
            response.sessionComplete = true
        } else {
            const selectedReport = session.reportId
                ? await interviewReportModel.findOne({ _id: session.reportId, user: userId })
                : null

            const previousQuestions = session.questions.map((item) => item.question)

            const nextQuestionData = await createNextQuestion({
                session,
                previousQuestions,
                report: selectedReport
            })

            const nextQuestionNumber = answeredCount + 1

            const nextQuestion = await mockQuestionModel.create({
                session: session._id,
                questionNumber: nextQuestionNumber,
                question: nextQuestionData.question,
                category: nextQuestionData.category,
                source: nextQuestionData.source
            })

            session.currentQuestionIndex = answeredCount
            session.questions.push(nextQuestion._id)
            await session.save()

            response.nextQuestion = {
                question: nextQuestion.question,
                source: nextQuestion.source,
                questionNumber: nextQuestionNumber,
                totalQuestions: TOTAL_QUESTIONS
            }
            response.summaryReady = false
        }

        return res.status(200).json(response)
    } catch (error) {
        console.error('Error submitting answer:', error)
        res.status(500).json({
            message: 'Error processing answer',
            error: error.message
        })
    }
}

/**
 * Get final summary for a completed mock interview
 * GET /api/interview/mock/summary/:sessionId
 */
async function getMockInterviewSummaryController(req, res) {
    try {
        const { sessionId } = req.params
        const userId = req.user.id

        const session = await mockInterviewModel.findOne({
            _id: sessionId,
            user: userId
        }).populate({
            path: 'questions',
            model: 'mockQuestions'
        })

        if (!session) {
            return res.status(404).json({ message: 'Mock interview session not found' })
        }

        if (session.status !== 'completed') {
            return res.status(400).json({ message: 'Interview session not yet completed' })
        }

        return res.status(200).json({
            message: 'Summary retrieved successfully',
            summary: {
                sessionId: session._id,
                role: session.role,
                difficulty: session.difficulty,
                overallScore: session.overallScore,
                totalQuestions: session.questions.length,
                totalTimeSpent: session.totalTimeSpent,
                questionsDetail: session.questions
                    .sort((a, b) => a.questionNumber - b.questionNumber)
                    .map((question) => ({
                        questionNumber: question.questionNumber,
                        question: question.question,
                        score: question.feedback?.score || 0,
                        userAnswer: question.userAnswer,
                        strengths: question.feedback?.strengths || [],
                        gaps: question.feedback?.gaps || []
                    })),
                weakAreas: session.weakAreas,
                improvementTips: session.improvementTips,
                completedAt: session.completedAt
            }
        })
    } catch (error) {
        console.error('Error getting summary:', error)
        return res.status(500).json({
            message: 'Error retrieving summary',
            error: error.message
        })
    }
}

/**
 * Get user's mock interview history
 * GET /api/interview/mock/history
 */
async function getMockInterviewHistoryController(req, res) {
    try {
        const userId = req.user.id

        const sessions = await mockInterviewModel.find({ user: userId })
            .select('_id role difficulty overallScore status completedAt createdAt totalTimeSpent')
            .sort({ createdAt: -1 })
            .limit(20)

        return res.status(200).json({
            message: 'History retrieved successfully',
            sessions: sessions.map((session) => ({
                sessionId: session._id,
                role: session.role,
                difficulty: session.difficulty,
                score: session.overallScore,
                status: session.status,
                completedAt: session.completedAt,
                createdAt: session.createdAt,
                totalTimeSpent: session.totalTimeSpent
            }))
        })
    } catch (error) {
        console.error('Error getting history:', error)
        return res.status(500).json({
            message: 'Error retrieving history',
            error: error.message
        })
    }
}

module.exports = {
    startMockInterviewController,
    submitAnswerController,
    getMockInterviewSummaryController,
    getMockInterviewHistoryController
}
