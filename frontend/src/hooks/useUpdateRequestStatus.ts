import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

const useUpdateRequestStatus = () => {
    const { toast } = useToast()

    const { mutate: updateRequestStatus, isPending: isUpdatingStatus } = useMutation({
        mutationKey: ["friendRequest"],
        mutationFn: async ({ requestId, status }: { requestId: string, status: string }) => {
            const res = await $axios.put(`requests/friend/${requestId}/?status=${status}`)
            return res.data;
        },
        onSuccess: () => {
            toast({
                title: 'Status updated',
                description: `Request successfully updated`
            })
        }
    })
    return { updateRequestStatus, isUpdatingStatus }
}

export default useUpdateRequestStatus