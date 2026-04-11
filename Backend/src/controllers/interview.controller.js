const pdfParse = require('pdf-parse');
const {generateInterviewReport} = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model")

const generateInterviewReportController = async (req, res) => {
    try {
        const resumeFile = req.file || req.files?.resume?.[0] || req.files?.file?.[0];
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required.",
            })
        }

        if (!resumeFile && !selfDescription) {
            return res.status(400).json({
                message: "Provide either resume file or self description.",
            })
        }

        let resumeText = ""
        if (resumeFile) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()
            resumeText = resumeContent.text
        }

        const interviewReportByAI = await generateInterviewReport(resumeText, selfDescription || "", jobDescription);

        if (!interviewReportByAI) {
            return res.status(502).json({
                message: "Failed to generate interview report from AI provider.",
            })
        }

        if (!interviewReportByAI.title || !String(interviewReportByAI.title).trim()) {
            return res.status(502).json({
                message: "Failed to generate interview report title from AI provider.",
            })
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            jobDescription,
            selfDescription,
            ...interviewReportByAI
        })

        res.status(200).json({
            message: 'Interview report generated successfully',
            interviewReport
        })
    } catch (error) {
        const statusCode = error?.statusCode || 502
        return res.status(statusCode).json({
            message: error?.message || "Failed to generate interview report.",
            details: error?.attempts || null,
        })
    }
}

async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}




module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController }