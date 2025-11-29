const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Public profile data (home/about section)
// @route   GET /api/profile
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    res.json(profile || {});
});

// @desc    Create or update profile
// @route   PUT /api/profile
// @access  Private/Admin
const upsertProfile = asyncHandler(async (req, res) => {
    const payload = {
        name: req.body.name,
        headline: req.body.headline,
        bio: req.body.bio,
        roles: req.body.roles,
        location: req.body.location,
        email: req.body.email,
        phone: req.body.phone,
        availability: req.body.availability,
        heroImage: req.body.heroImage,
        resumeIntro: req.body.resumeIntro,
        ctaLabel: req.body.ctaLabel
    };

    const profile = await Profile.findOneAndUpdate(
        {},
        payload,
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    res.json(profile);
});

module.exports = {
    getProfile,
    upsertProfile
};

