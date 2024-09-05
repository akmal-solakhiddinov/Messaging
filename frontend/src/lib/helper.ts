
const displayableImageTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'ico'];
const displayableVideoTypes = ['mp4', 'mov', 'wmv', 'flv', 'avi', 'mkv', 'webm'];
const displayableAudioTypes = ['mp3', 'wav', 'aac', 'ogg', 'flac'];


export const determineFileType = (fileName: string) => {

    const extension = fileName.split('.').pop()?.toLowerCase() || '';

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