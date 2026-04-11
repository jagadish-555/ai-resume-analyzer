const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');
const interviewRouter = express.Router();
const uploadInterviewFile = upload.fields([
	{ name: 'resume', maxCount: 1 },
	{ name: 'file', maxCount: 1 }
]);

interviewRouter.post('/', authMiddleware.authUser, uploadInterviewFile, interviewController.generateInterviewReportController);
interviewRouter.post('/report/:interviewId', authMiddleware.authUser, uploadInterviewFile, interviewController.generateInterviewReportController);

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)
module.exports = interviewRouter;