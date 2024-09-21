import { useEffect } from "react";

const useSEO = (title: string | undefined) => {
    useEffect(() => {
        document.title = title || 'Messaging';
    }, [title]);
    return null
}

export default useSEO