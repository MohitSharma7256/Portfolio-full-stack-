const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: String,
    publicId: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    fieldOfStudy: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    grade: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    highlights: [{
        type: String,
        trim: true
    }],
    logo: mediaSchema,
    location: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;

