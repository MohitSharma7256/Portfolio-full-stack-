const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: String,
    publicId: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    headline: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    roles: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    availability: {
        type: String,
        trim: true
    },
    heroImage: mediaSchema,
    resumeIntro: {
        type: String,
        trim: true
    },
    ctaLabel: {
        type: String,
        trim: true,
        default: 'Download Resume'
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

