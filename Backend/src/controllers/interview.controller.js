const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")





async function generateInterViewReportController(req, res) {

    try {
        const { selfDescription, jobDescription } = req.body

        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            })
        }

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to generate interview report",
            error: err.message
        })
    }

}


module.exports = { generateInterViewReportController }
