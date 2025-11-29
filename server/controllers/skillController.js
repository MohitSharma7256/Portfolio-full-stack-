const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get skills grouped by category
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
    }
    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
});

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
};

