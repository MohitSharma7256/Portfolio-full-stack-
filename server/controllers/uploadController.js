const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary using stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'portfolio',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }
                res.json({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadFile
};
