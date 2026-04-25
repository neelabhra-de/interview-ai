import axios from "axios";

const api = axios.create({
    baseURL: "https://interview-ai-a6k4.onrender.com",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData)

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume HTML based on user self description, resume content and job description.
 * Returns HTML that can be converted to PDF on the client side
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`)

    return response.data
}


/**
 * ────────────────────────────────────────────────────────────
 * MOCK INTERVIEW API FUNCTIONS (NEW FEATURE)
 * ────────────────────────────────────────────────────────────
 */

/**
 * @description Start a new mock interview session
 */
export const startMockInterview = async ({ role, difficulty }) => {
    const response = await api.post("/api/interview/mock/start", { role, difficulty })
    return response.data
}


/**
 * @description Submit an answer to a mock interview question and get feedback
 */
export const submitMockAnswer = async ({ sessionId, answer }) => {
    const response = await api.post("/api/interview/mock/answer", { sessionId, answer })
    return response.data
}


/**
 * @description Get final summary of a completed mock interview
 */
export const getMockInterviewSummary = async (sessionId) => {
    const response = await api.get(`/api/interview/mock/summary/${sessionId}`)
    return response.data
}


/**
 * @description Get user's mock interview history (past sessions)
 */
export const getMockInterviewHistory = async () => {
    const response = await api.get("/api/interview/mock/history")
    return response.data
}