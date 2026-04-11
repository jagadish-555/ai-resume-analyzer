require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { generateInterviewReport } = require('./src/services/ai.service')
const {resume, selfDescription, jobDescription} = require('./src/services/temp');
generateInterviewReport(resume, selfDescription, jobDescription).catch((err) => {
    console.error('AI generation failed:', err.message);
});
connectDB();
app.listen(3000,()=>{
    console.log(`server running on port 3000`);
});