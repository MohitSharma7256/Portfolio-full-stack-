const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { _id: false });

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    replied: {
        type: Boolean,
        default: false
    },
    responses: [responseSchema]
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
