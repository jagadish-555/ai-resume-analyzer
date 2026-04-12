const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim: true,
        unique:[true, 'Username already taken']
    },
    email:{
        type:String,
        required:true,
        trim: true,
        lowercase: true,
        unique:[true, 'Account with this email already exists']
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    }
})
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;