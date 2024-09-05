import $axios from "@/http/axios"
import { UserType } from "@/lib/type";
import { useEffect, useState } from "react"

interface RoomProps {
    id: string;
    user: UserType
}

const useRoomFetch = () => {
    const [rooms, setRooms] = useState<RoomProps[]>([])
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true)
            try {
                const res = await $axios.get('/rooms/get-all')
                if (!res.data) {
                    throw new Error(res.data.message)
                }
                setRooms(res.data)
            } catch (error) {
                if (error instanceof Error)
                    setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRooms()
    }, [])

    return { error, loading, rooms }
}

export default useRoomFetch;