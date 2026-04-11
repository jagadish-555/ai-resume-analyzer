const pdfParse = require('pdf-parse');
const {generateInterviewReport} = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model")

const generateInterviewReportController = async (req, res) => {
    const resumeFile = req.file;

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()
    const {selfDescription, jobDescription} = req.body;
    const interviewReportByAI = await generateInterviewReport(resumeContent.text, selfDescription, jobDescription);


    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume: resumeContent.text,
        jobDescription,
        selfDescription,
        ...interviewReportByAI
     })
     res.status(200).json({
        message: 'Interview report generated successfully',
        interviewReport
     }
     )
}





module.exports = { generateInterviewReportController }