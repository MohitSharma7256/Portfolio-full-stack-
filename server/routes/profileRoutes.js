const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getProfile);

router.put(
    '/',
    protect,
    admin,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('roles').isArray({ min: 1 }).withMessage('At least one role is required')
    ],
    validateRequest,
    upsertProfile
);

module.exports = router;

