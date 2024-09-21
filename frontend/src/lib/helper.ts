



// export const formatTime = (time: string) => {
//     const given = new Date(time)
//     const now = new Date()



// }
export function formatTime(dateStr: string | undefined = ''): string {
    // Check if the date string is valid
    const date = new Date(dateStr || "");

    // If the date is invalid, return a fallback value (e.g., empty string or 'Invalid date')
    if (isNaN(date.getTime())) {
        return 'Invalid date'; // You can customize this as needed
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}



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