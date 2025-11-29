const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: String,
    publicId: String
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    durationLabel: {
        type: String,
        trim: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    responsibilities: [{
        type: String,
        trim: true
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    highlights: [{
        type: String,
        trim: true
    }],
    logo: mediaSchema
}, {
    timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;

