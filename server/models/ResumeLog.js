const mongoose = require('mongoose');

const resumeLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ResumeLog = mongoose.model('ResumeLog', resumeLogSchema);

module.exports = ResumeLog;
