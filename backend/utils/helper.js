const path = require("path");


const displayableImageTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'ico'];
const displayableVideoTypes = ['mp4', 'mov', 'wmv', 'flv', 'avi', 'mkv', 'webm'];
const displayableAudioTypes = ['mp3', 'wav', 'aac', 'ogg', 'flac'];

exports.determineFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    if (displayableImageTypes.includes(extension)) {
        return 'IMAGE';
    }
    if (displayableVideoTypes.includes(extension)) {
        return 'VIDEO';
    }
    if (displayableAudioTypes.includes(extension)) {
        return 'AUDIO';
    }

    return 'FILE';
};

exports.createFileName = (fileType, originalName = 'file-01') => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '');
    const extension = path.extname(originalName);

    return `${fileType}-${formattedDate}-${formattedTime}${extension}`;
};

