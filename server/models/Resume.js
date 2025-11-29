const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    storagePath: {
        type: String,
        required: true,
        unique: true
    },
    bytes: {
        type: Number,
        default: 0
    },
    format: String,
    mimeType: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

