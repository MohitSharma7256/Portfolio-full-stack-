const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProjects,
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const projectValidators = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
];

router.route('/')
    .get(getProjects)
    .post(protect, admin, projectValidators, validateRequest, createProject);

router.get('/admin/all', protect, admin, getAllProjects);

router.route('/:slug')
    .get(getProjectBySlug);

router.route('/:id')
    .put(protect, admin, projectValidators, validateRequest, updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;
