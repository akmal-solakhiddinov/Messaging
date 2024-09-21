import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const useCreateRoom = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { mutate: createRoom, isPending: isCreatingRoom, data: newRoom } = useMutation({
        mutationKey: ["createRoom"],
        mutationFn: async (friendId: string | undefined) => {
            const res = await $axios.post(`rooms/create/${friendId}`);

            navigate(`/room/${res.data.id}`)
            return res.data;
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message
            })
        }
    })
    return { createRoom, isCreatingRoom, newRoom }
}

export default useCreateRoom