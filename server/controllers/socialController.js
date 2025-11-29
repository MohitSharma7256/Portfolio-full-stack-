const SocialLink = require('../models/SocialLink');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get social links
// @route   GET /api/social
// @access  Public
const getSocialLinks = asyncHandler(async (req, res) => {
    const links = await SocialLink.find().sort({ order: 1, createdAt: 1 });
    res.json(links);
});

// @desc    Create social link
// @route   POST /api/social
// @access  Private/Admin
const createSocialLink = asyncHandler(async (req, res) => {
    const link = await SocialLink.create(req.body);
    res.status(201).json(link);
});

// @desc    Update social link
// @route   PUT /api/social/:id
// @access  Private/Admin
const updateSocialLink = asyncHandler(async (req, res) => {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!link) {
        return res.status(404).json({ message: 'Social link not found' });
    }
    res.json(link);
});

// @desc    Delete social link
// @route   DELETE /api/social/:id
// @access  Private/Admin
const deleteSocialLink = asyncHandler(async (req, res) => {
    const link = await SocialLink.findById(req.params.id);
    if (!link) {
        return res.status(404).json({ message: 'Social link not found' });
    }
    await link.deleteOne();
    res.json({ message: 'Social link removed' });
});

module.exports = {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
};

