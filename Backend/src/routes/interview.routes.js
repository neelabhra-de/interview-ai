const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const mockController = require("../controllers/mock.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


/**
 * ────────────────────────────────────────────────────────────
 * MOCK INTERVIEW ROUTES (NEW FEATURE)
 * ────────────────────────────────────────────────────────────
 */

/**
 * @route POST /api/interview/mock/start
 * @description Start a new mock interview session
 * @access private
 */
interviewRouter.post("/mock/start", authMiddleware.authUser, mockController.startMockInterviewController)


/**
 * @route POST /api/interview/mock/answer
 * @description Submit an answer to a mock interview question and get feedback
 * @access private
 */
interviewRouter.post("/mock/answer", authMiddleware.authUser, mockController.submitAnswerController)


/**
 * @route GET /api/interview/mock/summary/:sessionId
 * @description Get final summary of a completed mock interview
 * @access private
 */
interviewRouter.get("/mock/summary/:sessionId", authMiddleware.authUser, mockController.getMockInterviewSummaryController)


/**
 * @route GET /api/interview/mock/history
 * @description Get user's mock interview history (past sessions)
 * @access private
 */
interviewRouter.get("/mock/history", authMiddleware.authUser, mockController.getMockInterviewHistoryController)


module.exports = interviewRouter