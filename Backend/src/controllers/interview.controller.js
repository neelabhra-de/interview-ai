const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const mongoose = require("mongoose")





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

async function getInterviewReportByIdController(req, res) {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid interview report id"
            })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: id,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            interviewReport
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch interview report",
            error: err.message
        })
    }
}

async function downloadResumeTextController(req, res) {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid interview report id"
            })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: id,
            user: req.user.id
        }).select("resume title")

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        const filenameBase = (interviewReport.title || "resume")
            .replace(/[^a-z0-9-_ ]/gi, "")
            .trim()
            .replace(/\s+/g, "-") || "resume"

        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}-resume.txt"`)
        res.status(200).send(interviewReport.resume || "")
    } catch (err) {
        res.status(500).json({
            message: "Failed to download resume",
            error: err.message
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    downloadResumeTextController
}
