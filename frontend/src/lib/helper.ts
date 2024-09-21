



// export const formatTime = (time: string) => {
//     const given = new Date(time)
//     const now = new Date()



// }



export function formatTime(dateStr: string | undefined): string {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr || "")
    );
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