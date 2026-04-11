
const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, 'Job description is required']
    },
    resume:{
        type: String,
    },
    selfDescription:{
        type: String,
    },
    matchScore:{
        type: Number,
        min:0,
        max:100
    },
    technicalQuestionsSchema: [technicalQuestionsSchema],
    behavioralQuestionsSchema: [behavioralQuestionsSchema],
    skillGapsSchema: [skillGapsSchema],
    preperationPlanSchema: [preperationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }

},{
    timestamps: true
});

const technicalQuestionsSchema = new mongoose.Schema({
    question:{
        string: String,
        required: [true, 'Question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{
    _id: false
});

const behavioralQuestionsSchema = new mongoose.Schema({
    question:{
        string: String,
        required: [true, 'Question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{
    _id: false
});

const skillGapsSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, 'Skill is required']
    },
    severity:{
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: [true, 'Severity is required']
    }
},{
    _id: false
});

const preperationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required: [true, 'Day is required']
    },
    focus:{
        type: String,
        required: [true, 'Focus is required']
    },
    tasks:[{
        type: String,
        required: [true, 'Task is required']

    }]
});


const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReportModel;

