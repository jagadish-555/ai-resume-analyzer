const pdfParse = require('pdf-parse');
const {generateInterviewReport} = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model")

const generateInterviewReportController = async (req, res) => {
    const resumeFile = req.file;

    const resumeContent = await pdfParse(resumeFile.buffer);
    const {selfDescription, jobDescription} = req.body;
    const interviewReportByAI = await generateInterviewReport(resumeContent, selfDescription, jobDescription);


    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume: resumeContent,
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