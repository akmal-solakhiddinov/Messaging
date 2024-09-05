const { storage } = require('../config/firebase.js');
const { createFileName } = require("../utils/helper.js");

exports.uploadFile = async (fileType, file) => {
    try {

        const name = createFileName(fileType, file.originalname);
        const fileName = `${fileType}/${name}`;
        const fileRef = storage.file(fileName);

        const stream = fileRef.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on('error', (err) => {
            console.error('Error during file upload:', err);
            throw err;
        });

        return new Promise((resolve, reject) => {
            stream.on('finish', async () => {
                try {
                    const [publicUrl] = await fileRef.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    });
                    resolve(publicUrl);
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    reject(error);
                }
            });

            stream.end(file.buffer);
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
