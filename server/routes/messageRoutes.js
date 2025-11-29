const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    markMessageAsRead,
    replyToMessage,
    deleteMessage
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many messages sent. Please try again later.'
});

router.route('/')
    .post(protect, messageLimiter, sendMessage)
    .get(protect, admin, getMessages);

router.route('/:id')
    .delete(protect, admin, deleteMessage);

router.route('/:id/read')
    .put(protect, admin, markMessageAsRead);

router.route('/:id/reply')
    .post(protect, admin, replyToMessage);

module.exports = router;
