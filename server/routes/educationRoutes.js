const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation
} = require('../controllers/educationController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getEducation);

const educationValidators = [
    body('institution').notEmpty().withMessage('Institution name is required'),
    body('degree').notEmpty().withMessage('Degree is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required')
];

router.post('/', protect, admin, educationValidators, validateRequest, createEducation);
router.put('/:id', protect, admin, educationValidators, validateRequest, updateEducation);
router.delete('/:id', protect, admin, deleteEducation);

module.exports = router;

