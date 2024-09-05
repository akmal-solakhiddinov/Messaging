import $axios from "@/http/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query"



interface EditMessageParams {
    data: FormData;
    messageId: string;
}


const useEditMessage = () => {
    const queryClient = useQueryClient()
    const { mutate: editMessage, isPending: isEditing } = useMutation({
        mutationFn: async ({ data, messageId }: EditMessageParams) => {



            const res = await $axios.put(`messages/update/${messageId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages"]
            });
        },
    });

    return { editMessage, isEditing }
}

export default useEditMessage