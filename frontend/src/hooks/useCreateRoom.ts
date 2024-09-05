import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const useCreateRoom = () => {
    const navigate = useNavigate()
    const { mutate: createRoom, isPending: isCreatingRoom, data: newRoom } = useMutation({
        mutationKey: ["createRoom"],
        mutationFn: async (friendId) => {
            const res = await $axios.post(`rooms/create/${friendId}`);

            navigate(`/room/${res.data.id}`)
            return res.data;
        }
    })
    return { createRoom, isCreatingRoom, newRoom }
}

export default useCreateRoom