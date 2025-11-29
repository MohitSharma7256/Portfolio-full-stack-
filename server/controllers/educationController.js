const Education = require('../models/Education');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get education history
// @route   GET /api/education
// @access  Public
const getEducation = asyncHandler(async (req, res) => {
    const education = await Education.find().sort({ startDate: -1 });
    res.json(education);
});

// @desc    Create education entry
// @route   POST /api/education
// @access  Private/Admin
const createEducation = asyncHandler(async (req, res) => {
    const entry = await Education.create(req.body);
    res.status(201).json(entry);
});

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private/Admin
const updateEducation = asyncHandler(async (req, res) => {
    const entry = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) {
        return res.status(404).json({ message: 'Education entry not found' });
    }
    res.json(entry);
});

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private/Admin
const deleteEducation = asyncHandler(async (req, res) => {
    const entry = await Education.findById(req.params.id);
    if (!entry) {
        return res.status(404).json({ message: 'Education entry not found' });
    }
    await entry.deleteOne();
    res.json({ message: 'Education entry removed' });
});

module.exports = {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation
};

