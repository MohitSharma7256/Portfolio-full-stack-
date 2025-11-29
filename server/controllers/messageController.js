const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const { sendMail } = require('../utils/emailService');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
    const { subject, body, name, email } = req.body;

    // Use authenticated user data if available, otherwise use provided data
    const messageData = {
        sender: req.user?._id || null,
        name: req.user?.name || name,
        email: req.user?.email || email,
        subject,
        body
    };

    // Validate required fields for unauthenticated users
    if (!messageData.name || !messageData.email) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    const message = await Message.create(messageData);

    // Send email notification
    try {
        await sendMail({
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM,
            subject: `New portfolio message: ${subject}`,
            text: `${messageData.name} (${messageData.email}) says:\n\n${body}`
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
        // Don't fail the request if email fails
    }

    res.status(201).json(message);
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const markMessageAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
});

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
const replyToMessage = asyncHandler(async (req, res) => {
    const { response } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.responses.push({
        body: response,
        sentBy: req.user._id
    });
    message.replied = true;
    await message.save();

    await sendMail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        text: response
    });

    res.json(message);
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
});

module.exports = {
    sendMessage,
    getMessages,
    markMessageAsRead,
    replyToMessage,
    deleteMessage
};
