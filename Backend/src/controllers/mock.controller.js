const mockInterviewModel = require("../models/mockInterview.model");
const mockQuestionModel = require("../models/mockQuestion.model");
const { 
    generateMockQuestion, 
    generateAnswerFeedback, 
    generateMockInterviewSummary 
} = require("../services/ai.service");


/**
 * Start a new mock interview session
 * POST /api/interview/mock/start
 * @param {String} role - Job role
 * @param {String} difficulty - beginner/intermediate/advanced
 * @param {String} reportId - (Optional) Link to existing interview report
 */
async function startMockInterviewController(req, res) {
    try {
        const { role, difficulty = "intermediate", reportId } = req.body;
        const userId = req.user.id;

        // Validate inputs
        if (!role) {
            return res.status(400).json({
                message: "Role is required"
            });
        }

        if (!["beginner", "intermediate", "advanced"].includes(difficulty)) {
            return res.status(400).json({
                message: "Difficulty must be beginner, intermediate, or advanced"
            });
        }

        // Create mock interview session
        const mockSession = await mockInterviewModel.create({
            user: userId,
            role,
            difficulty,
            reportId: reportId || null,
            status: "in-progress",
            questions: []
        });

        // Generate first question
        let categories = ["technical", "behavioral"];
        if (difficulty === "advanced") {
            categories.push("system-design");
        }
        
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const questionData = await generateMockQuestion({
            role,
            difficulty,
            category: randomCategory,
            previousQuestions: []
        });

        // Create first question document
        const firstQuestion = await mockQuestionModel.create({
            session: mockSession._id,
            questionNumber: 1,
            question: questionData.question,
            category: questionData.category,
            source: "fresh"
        });

        // Update session with first question
        mockSession.questions.push(firstQuestion._id);
        mockSession.currentQuestionIndex = 0;
        await mockSession.save();

        res.status(201).json({
            message: "Mock interview started successfully",
            session: {
                sessionId: mockSession._id,
                question: firstQuestion.question,
                questionNumber: 1,
                totalQuestions: 8, // Fixed number of questions per session
                difficulty: mockSession.difficulty,
                role: mockSession.role
            }
        });

    } catch (error) {
        console.error("Error starting mock interview:", error);
        res.status(500).json({
            message: "Error starting mock interview",
            error: error.message
        });
    }
}


/**
 * Submit an answer to a mock interview question and get feedback
 * POST /api/interview/mock/answer
 * @param {String} sessionId - Mock interview session ID
 * @param {String} answer - User's answer text
 */
async function submitAnswerController(req, res) {
    try {
        const { sessionId, answer } = req.body;
        const userId = req.user.id;

        if (!sessionId || !answer || !answer.trim()) {
            return res.status(400).json({
                message: "Session ID and answer are required"
            });
        }

        // Get session
        const session = await mockInterviewModel.findOne({ 
            _id: sessionId, 
            user: userId 
        }).populate({
            path: "questions",
            model: "mockQuestions"
        });

        if (!session) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        if (session.status !== "in-progress") {
            return res.status(400).json({
                message: "This mock interview session is already completed"
            });
        }

        // Get current question
        const currentQuestion = session.questions[session.currentQuestionIndex];
        
        if (!currentQuestion) {
            return res.status(400).json({
                message: "Invalid question index"
            });
        }

        // Update question with answer
        currentQuestion.userAnswer = answer;
        currentQuestion.answeredAt = new Date();

        // Generate feedback using AI
        const feedback = await generateAnswerFeedback({
            question: currentQuestion.question,
            userAnswer: answer,
            role: session.role,
            difficulty: session.difficulty
        });

        currentQuestion.feedback = {
            score: feedback.score,
            strengths: feedback.strengths,
            gaps: feedback.gaps,
            improvedAnswer: feedback.improvedAnswer,
            generatedAt: new Date()
        };

        await currentQuestion.save();

        // Check if this was the last question
        const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;
        const questionsRemaining = 8 - (session.currentQuestionIndex + 1);

        let response = {
            message: "Answer submitted successfully",
            feedback: {
                score: feedback.score,
                strengths: feedback.strengths,
                gaps: feedback.gaps,
                improvedAnswer: feedback.improvedAnswer
            },
            questionNumber: session.currentQuestionIndex + 1,
            questionsRemaining
        };

        // If not last question, generate next one
        if (!isLastQuestion && session.currentQuestionIndex < 7) {
            session.currentQuestionIndex += 1;

            // Get all previous questions for context
            const previousQuestions = session.questions
                .slice(0, session.currentQuestionIndex)
                .map(q => q.question);

            // Vary question categories
            let categories = ["technical", "behavioral"];
            if (session.difficulty === "advanced") {
                categories.push("system-design");
            }
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            const nextQuestionData = await generateMockQuestion({
                role: session.role,
                difficulty: session.difficulty,
                category: randomCategory,
                previousQuestions
            });

            const nextQuestion = await mockQuestionModel.create({
                session: session._id,
                questionNumber: session.currentQuestionIndex + 1,
                question: nextQuestionData.question,
                category: nextQuestionData.category,
                source: "fresh"
            });

            session.questions.push(nextQuestion._id);
            await session.save();

            response.nextQuestion = {
                question: nextQuestion.question,
                questionNumber: session.currentQuestionIndex + 1,
                totalQuestions: 8
            };
            response.summaryReady = false;

        } else {
            // Generate final summary
            session.status = "completed";
            session.completedAt = new Date();

            // Calculate overall score
            const allQuestions = await mockQuestionModel.find({ 
                session: sessionId 
            });

            const scores = allQuestions.map(q => q.feedback?.score || 0);
            const overallScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
            session.overallScore = overallScore;

            // Get summary
            const summary = await generateMockInterviewSummary({
                questions: allQuestions.map(q => ({
                    question: q.question,
                    userAnswer: q.userAnswer,
                    feedback: q.feedback
                })),
                role: session.role
            });

            session.weakAreas = summary.weakAreas || [];
            session.improvementTips = summary.improvementTips || [];

            await session.save();

            response.summaryReady = true;
            response.sessionComplete = true;
        }

        res.status(200).json(response);

    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({
            message: "Error processing answer",
            error: error.message
        });
    }
}


/**
 * Get final summary for a completed mock interview
 * GET /api/interview/mock/summary/:sessionId
 */
async function getMockInterviewSummaryController(req, res) {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const session = await mockInterviewModel.findOne({
            _id: sessionId,
            user: userId
        }).populate({
            path: "questions",
            model: "mockQuestions"
        });

        if (!session) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        if (session.status !== "completed") {
            return res.status(400).json({
                message: "Interview session not yet completed"
            });
        }

        res.status(200).json({
            message: "Summary retrieved successfully",
            summary: {
                sessionId: session._id,
                role: session.role,
                difficulty: session.difficulty,
                overallScore: session.overallScore,
                totalQuestions: session.questions.length,
                totalTimeSpent: session.totalTimeSpent,
                questionsDetail: session.questions.map(q => ({
                    questionNumber: q.questionNumber,
                    question: q.question,
                    score: q.feedback?.score || 0,
                    userAnswer: q.userAnswer,
                    strengths: q.feedback?.strengths || [],
                    gaps: q.feedback?.gaps || []
                })),
                weakAreas: session.weakAreas,
                improvementTips: session.improvementTips,
                completedAt: session.completedAt
            }
        });

    } catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({
            message: "Error retrieving summary",
            error: error.message
        });
    }
}


/**
 * Get user's mock interview history
 * GET /api/interview/mock/history
 */
async function getMockInterviewHistoryController(req, res) {
    try {
        const userId = req.user.id;

        const sessions = await mockInterviewModel.find({ user: userId })
            .select("_id role difficulty overallScore status completedAt createdAt totalTimeSpent")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            message: "History retrieved successfully",
            sessions: sessions.map(s => ({
                sessionId: s._id,
                role: s.role,
                difficulty: s.difficulty,
                score: s.overallScore,
                status: s.status,
                completedAt: s.completedAt,
                createdAt: s.createdAt,
                totalTimeSpent: s.totalTimeSpent
            }))
        });

    } catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({
            message: "Error retrieving history",
            error: error.message
        });
    }
}


module.exports = {
    startMockInterviewController,
    submitAnswerController,
    getMockInterviewSummaryController,
    getMockInterviewHistoryController
};
