const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getExperience);

const experienceValidators = [
    body('company').notEmpty().withMessage('Company is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required')
];

router.post('/', protect, admin, experienceValidators, validateRequest, createExperience);
router.put('/:id', protect, admin, experienceValidators, validateRequest, updateExperience);
router.delete('/:id', protect, admin, deleteExperience);

module.exports = router;

