import { useCallback, useState } from "react"
import { downloadResumeText, generateInterviewReport, getInterviewReportById } from "../services/interview.api"

export const useInterview = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [reports, setReports] = useState([])
    const [report, setReport] = useState(null)

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")

        try {
            const data = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            const report = data.interviewReport
            setReport(report)
            setReports((currentReports) => [report, ...currentReports])
            return report
        } finally {
            setLoading(false)
        }
    }, [])

    const getReportById = useCallback(async (id) => {
        setLoading(true)
        setError("")

        try {
            const data = await getInterviewReportById(id)
            setReport(data.interviewReport)
            return data.interviewReport
        } catch (err) {
            setReport(null)
            setError(err.response?.data?.message || "Failed to load interview report.")
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const getResumePdf = useCallback(async (id) => {
        setError("")

        try {
            const resumeBlob = await downloadResumeText(id)
            const resumeUrl = window.URL.createObjectURL(resumeBlob)
            const link = document.createElement("a")

            link.href = resumeUrl
            link.download = "resume.txt"
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(resumeUrl)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to download resume.")
        }
    }, [])

    return { loading, error, report, reports, generateReport, getReportById, getResumePdf }
}
