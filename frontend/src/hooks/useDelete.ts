import $axios from "@/http/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useDelete = () => {
    const queryClient = useQueryClient();
    const { mutate: deleteItem, isPending: isDeleting } = useMutation({
        mutationFn: (itemLink: string) => {
            return $axios.delete(itemLink)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages"]
            })
        }
    })
    return { deleteItem, isDeleting }
}

export default useDelete;