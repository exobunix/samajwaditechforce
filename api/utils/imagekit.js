const ImageKit = require('imagekit');
const crypto = require('crypto');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_dummy_key_123',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_dummy_key_123',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy_endpoint_123'
});

/**
 * Helper to upload image or video to ImageKit
 */
const uploadToImageKit = async (fileData, folder = 'samajwadi', type = 'image') => {
    try {
        let fileBufferOrString = fileData;
        let fileName = `${type}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        if (Buffer.isBuffer(fileData)) {
            // Buffer
            fileBufferOrString = fileData;
        } else if (typeof fileData === 'string') {
            if (fileData.startsWith('data:')) {
                // Base64 Data URI
                const parts = fileData.split(',');
                fileBufferOrString = parts[1] || fileData;
                const mime = parts[0].match(/data:(.*?);/);
                if (mime) {
                    const ext = mime[1].split('/')[1];
                    fileName += `.${ext}`;
                }
            } else if (fileData.startsWith('http')) {
                // URL string
                fileBufferOrString = fileData;
            } else {
                // Raw Base64 string
                fileBufferOrString = fileData;
            }
        }

        const uploadOptions = {
            file: fileBufferOrString,
            fileName: fileName,
            folder: `/${folder}`
        };

        const result = await imagekit.upload(uploadOptions);
        console.log(`✅ ImageKit Upload Success: ${result.url}`);
        return {
            url: result.url,
            key: result.fileId, // Use fileId as the unique key
            bytes: result.size,
            optimizedUrl: result.url // ImageKit provides optimization natively via URL transformations
        };
    } catch (error) {
        console.error('❌ ImageKit upload error:', error);
        throw new Error('Upload to ImageKit failed: ' + error.message);
    }
};

const uploadImageToImageKit = (imageData, folder = 'images') => {
    return uploadToImageKit(imageData, folder, 'image');
};

const uploadVideoToImageKit = (videoData, folder = 'videos') => {
    return uploadToImageKit(videoData, folder, 'video');
};

const uploadBase64ToImageKit = async (base64String, folder = 'images') => {
    const result = await uploadToImageKit(base64String, folder, 'image');
    return result.url;
};

const deleteFromImageKit = async (fileId) => {
    try {
        if (!fileId) return false;
        await imagekit.deleteFile(fileId);
        console.log(`🗑️ ImageKit Delete Success: ${fileId}`);
        return true;
    } catch (error) {
        console.error('❌ ImageKit delete error:', error);
        return false;
    }
};

module.exports = {
    uploadImageToImageKit,
    uploadVideoToImageKit,
    uploadBase64ToImageKit,
    deleteFromImageKit
};
