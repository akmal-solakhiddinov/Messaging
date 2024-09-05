import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

const useCreateRequest = () => {
    const { mutate: createFriendRequest, isPending: isCreatingRequest } = useMutation({
        mutationKey: ["friendRequest"],
        mutationFn: async (friendId: string) => {
            const res = await $axios.post(`requests/friend/${friendId}`)
            return res.data;
        }
    })
    return { createFriendRequest, isCreatingRequest }
}

export default useCreateRequest