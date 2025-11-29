const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
    url: String,
    publicId: String
}, { _id: false });

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    icon: iconSchema,
    description: {
        type: String,
        trim: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

