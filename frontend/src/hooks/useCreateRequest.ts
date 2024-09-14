import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

const useCreateRequest = () => {
    const { toast } = useToast()
    const { mutate: createFriendRequest, isPending: isCreatingRequest } = useMutation({
        mutationKey: ["friendRequest"],
        mutationFn: async (friendId: string) => {
            const res = await $axios.post(`requests/friend/${friendId}`)
            return res.data;
        },
        onSuccess: () => {
            toast({ title: 'Friend request', description: 'Friend request successfully sended' })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message
            })
        }
    })
    return { createFriendRequest, isCreatingRequest }
}

export default useCreateRequest