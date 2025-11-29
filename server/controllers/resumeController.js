const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const ResumeLog = require('../models/ResumeLog');
const asyncHandler = require('../utils/asyncHandler');

const resumeDir = path.join(__dirname, '..', 'uploads', 'resume');

const ensureResumeDir = () => {
    if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
    }
};

// @desc    Get active resume metadata (admin use)
// @route   GET /api/resume
// @access  Private/Admin
const getResumeMeta = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!resume) {
        return res.status(404).json({ message: 'No active resume found' });
    }
    res.json(resume);
});

// @desc    Upload new resume to Cloudinary
// @route   POST /api/resume
// @access  Private/Admin
const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No resume file provided' });
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    ensureResumeDir();

    const safeName = req.file.originalname.replace(/\s+/g, '_');
    const storedFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(resumeDir, storedFileName);

    fs.writeFileSync(filePath, req.file.buffer);

    await Resume.updateMany({}, { isActive: false });

    const resume = await Resume.create({
        fileName: req.file.originalname,
        storagePath: storedFileName,
        bytes: req.file.size,
        format: fileExtension,
        mimeType: req.file.mimetype,
        uploadedBy: req.user._id,
        isActive: true
    });

    res.status(201).json(resume);
});

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private/Admin
const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.storagePath) {
        const filePath = path.join(resumeDir, resume.storagePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
});

// @desc    Download resume (authenticated users)
// @route   POST /api/resume/download
// @access  Private
const downloadResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) {
        return res.status(404).json({ message: 'Resume not available' });
    }

    await ResumeLog.create({
        userId: req.user._id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    await Resume.findByIdAndUpdate(resume._id, { $inc: { downloadCount: 1 } });

    if (!resume.storagePath) {
        return res.status(404).json({ message: 'Resume file missing' });
    }

    ensureResumeDir();
    const filePath = path.join(resumeDir, resume.storagePath);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Resume file missing' });
    }

    res.setHeader('Content-Type', resume.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resume.fileName)}"`);
    res.download(filePath, resume.fileName);
});

module.exports = {
    getResumeMeta,
    uploadResume,
    deleteResume,
    downloadResume
};
