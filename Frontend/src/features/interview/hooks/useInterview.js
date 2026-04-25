import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, startMockInterview as apiStartMockInterview, submitMockAnswer as apiSubmitMockAnswer, getMockInterviewSummary, getMockInterviewHistory } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import html2pdf from "html2pdf.js"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { id } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, error, setError, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.message || "Could not generate the interview report.")
            throw error
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }, [ setError, setLoading, setReport ])

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            setReport(null)
            setError(error.response?.data?.message || "Could not load the interview report.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }, [ setError, setLoading, setReport ])

    const getReports = useCallback(async () => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.message || "Could not load interview reports.")
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }, [ setError, setLoading, setReports ])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setError("")
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            
            // Create a temporary div to hold the HTML
            const element = document.createElement("div")
            element.innerHTML = response.resumeHtml
            element.style.padding = "20px"
            
            // Configure html2pdf options
            const opt = {
                margin: 10,
                filename: `resume_${interviewReportId}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
            }
            
            // Generate and download PDF
            await html2pdf().set(opt).from(element).save()
        }
        catch (error) {
            console.log(error)
            setError(error.response?.data?.message || "Could not download the resume PDF.")
        }
    }, [ setError ])

    /**
     * Mock Interview Functions
     */

    const startMockInterview = useCallback(async ({ role, difficulty }) => {
        setError("")
        try {
            const response = await apiStartMockInterview({ role, difficulty })
            return response
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || "Could not start mock interview."
            setError(errorMsg)
            throw new Error(errorMsg)
        }
    }, [setError])

    const submitMockAnswer = useCallback(async ({ sessionId, answer }) => {
        setError("")
        try {
            const response = await apiSubmitMockAnswer({ sessionId, answer })
            return response
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || "Could not submit answer."
            setError(errorMsg)
            throw new Error(errorMsg)
        }
    }, [setError])

    const getMockSummary = useCallback(async (sessionId) => {
        setError("")
        try {
            const response = await getMockInterviewSummary(sessionId)
            return response.summary
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || "Could not get summary."
            setError(errorMsg)
            throw new Error(errorMsg)
        }
    }, [setError])

    const getMockHistory = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const response = await getMockInterviewHistory()
            return response.sessions
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || "Could not get history."
            setError(errorMsg)
            throw new Error(errorMsg)
        } finally {
            setLoading(false)
        }
    }, [setError, setLoading])

    useEffect(() => {
        if (id) {
            getReportById(id)
        } else {
            getReports()
        }
    }, [ id, getReportById, getReports ])

    return { 
        loading, 
        error, 
        report, 
        reports, 
        generateReport, 
        getReportById, 
        getReports, 
        getResumePdf,
        // Mock interview functions
        startMockInterview,
        submitMockAnswer,
        getMockSummary,
        getMockHistory
    }

}
