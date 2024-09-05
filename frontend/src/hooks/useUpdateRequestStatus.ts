import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

const useUpdateRequestStatus = () => {
    const { mutate: updateRequestStatus, isPending: isUpdatingStatus } = useMutation({
        mutationKey: ["friendRequest"],
        mutationFn: async ({ requestId, status }: { requestId: string, status: string }) => {
            const res = await $axios.put(`requests/friend/${requestId}/?status=${status}`)
            return res.data;
        }
    })
    return { updateRequestStatus, isUpdatingStatus }
}

export default useUpdateRequestStatus