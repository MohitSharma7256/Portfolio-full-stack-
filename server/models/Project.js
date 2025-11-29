const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    tech: [{
        type: String
    }],
    images: [{
        url: String,
        publicId: String
    }],
    demoUrl: {
        type: String
    },
    repoUrl: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
