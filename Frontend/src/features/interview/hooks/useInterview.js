import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


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
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
            setError(error.response?.data?.message || "Could not download the resume PDF.")
        } finally {
            setLoading(false)
        }
    }, [ setError, setLoading ])

    useEffect(() => {
        if (id) {
            getReportById(id)
        } else {
            getReports()
        }
    }, [ id, getReportById, getReports ])

    return { loading, error, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
