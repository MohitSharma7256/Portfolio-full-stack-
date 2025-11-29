const express = require('express');
const router = express.Router();
const {
    getResumeMeta,
    uploadResume,
    deleteResume,
    downloadResume
} = require('../controllers/resumeController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
    .get(protect, admin, getResumeMeta)
    .post(protect, admin, upload.single('file'), uploadResume);

router.route('/:id')
    .delete(protect, admin, deleteResume);

router.post('/download', protect, downloadResume);

module.exports = router;
