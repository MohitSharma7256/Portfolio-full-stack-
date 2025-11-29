const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const registerValidators = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidators = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidators, validateRequest, registerUser);
router.post('/login', loginValidators, validateRequest, loginUser);
router.post('/logout', logoutUser);
router.get('/refresh', refreshAccessToken);

module.exports = router;
