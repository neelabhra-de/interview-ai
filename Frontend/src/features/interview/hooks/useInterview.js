import { useState } from "react"
import { generateInterviewReport } from "../services/interview.api"

export const useInterview = () => {
    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)

        try {
            const data = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            const report = data.interviewReport
            setReports((currentReports) => [report, ...currentReports])
            return report
        } finally {
            setLoading(false)
        }
    }

    return { loading, reports, generateReport }
}
