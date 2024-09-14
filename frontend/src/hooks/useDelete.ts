import { useToast } from "@/components/ui/use-toast";
import $axios from "@/http/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useDelete = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const { mutate: deleteItem, isPending: isDeleting } = useMutation({
        mutationFn: (itemLink: string) => {
            return $axios.delete(itemLink)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages"]
            })

            toast({
                title: 'Delete',
                description: "Successfully delete"
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message
            })
        }
    })
    return { deleteItem, isDeleting }
}

export default useDelete;