const Message = require('../models/Message');
const Project = require('../models/Project');
const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Aggregated dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const [projectCount, totalMessages, unreadMessages, resume] = await Promise.all([
        Project.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ isRead: false }),
        Resume.findOne({ isActive: true })
    ]);

    res.json({
        projectCount,
        totalMessages,
        unreadMessages,
        resumeDownloads: resume?.downloadCount || 0
    });
});

module.exports = {
    getDashboardStats
};

