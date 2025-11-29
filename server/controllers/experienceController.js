const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get experiences timeline
// @route   GET /api/experience
// @access  Public
const getExperience = asyncHandler(async (req, res) => {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
});

// @desc    Create experience entry
// @route   POST /api/experience
// @access  Private/Admin
const createExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
});

// @desc    Update experience
// @route   PUT /api/experience/:id
const updateExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!experience) {
        return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
});

// @desc    Delete experience
// @route   DELETE /api/experience/:id
const deleteExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        return res.status(404).json({ message: 'Experience not found' });
    }
    await experience.deleteOne();
    res.json({ message: 'Experience removed' });
});

module.exports = {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
};

