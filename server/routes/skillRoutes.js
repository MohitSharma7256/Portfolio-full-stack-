const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getSkills);

const skillValidators = [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('level').optional().isInt({ min: 0, max: 100 }).withMessage('Level must be between 0-100')
];

router.post('/', protect, admin, skillValidators, validateRequest, createSkill);
router.put('/:id', protect, admin, skillValidators, validateRequest, updateSkill);
router.delete('/:id', protect, admin, deleteSkill);

module.exports = router;

