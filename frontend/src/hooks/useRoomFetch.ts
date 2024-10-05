import $axios from "@/http/axios"
import { UserType } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

interface RoomProps {
    id: string;
    user: UserType
}

const useRoomFetch = () => {
    const { data: rooms = [], error, isLoading } = useQuery<RoomProps[]>({
        queryKey: ["rooms"],
        queryFn: async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (accessToken) {
                const res = await $axios.get('/rooms/get-all')
                return res.data
            }
        }
    })


    return { error, isLoading, rooms }
}

export default useRoomFetch;