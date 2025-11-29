const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
} = require('../controllers/socialController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getSocialLinks);

const socialValidators = [
    body('platform').notEmpty().withMessage('Platform is required'),
    body('url').isURL().withMessage('Valid URL is required')
];

router.post('/', protect, admin, socialValidators, validateRequest, createSocialLink);
router.put('/:id', protect, admin, socialValidators, validateRequest, updateSocialLink);
router.delete('/:id', protect, admin, deleteSocialLink);

module.exports = router;

