import $axios from "@/http/axios"
import { useEffect, useState } from "react"

const useRoomFetch = () => {
    const [rooms, setRooms] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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