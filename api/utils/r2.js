const {
    uploadImageToImageKit,
    uploadVideoToImageKit,
    uploadBase64ToImageKit,
    deleteFromImageKit
} = require('./imagekit');

const getOptimizedImageUrl = (publicIdOrUrl) => {
    return publicIdOrUrl;
};

const getOptimizedVideoUrl = (publicIdOrUrl) => {
    return publicIdOrUrl;
};

module.exports = {
    // Main upload functions (Redirected to ImageKit)
    uploadImageToR2: uploadImageToImageKit,
    uploadBase64ToR2: uploadBase64ToImageKit,
    uploadVideoToR2: uploadVideoToImageKit,
    uploadFileToR2: uploadImageToImageKit,
    deleteFromR2: deleteFromImageKit,

    // Backward-compatible aliases
    uploadBase64ToCloudinary: uploadBase64ToImageKit,
    uploadImageOptimized: uploadImageToImageKit,
    uploadVideoOptimized: uploadVideoToImageKit,
    getOptimizedImageUrl,
    getOptimizedVideoUrl,

    // Utility
    compressImage: async (buf) => ({ buffer: buf, contentType: 'image/webp', ext: '.webp' }),
};
