import $axios from "@/http/axios";
import { determineFileType } from "@/lib/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useEditMessage = () => {
    const queryClient = useQueryClient()
    const { mutate: editMessage, isPending: isEditing } = useMutation({
        mutationFn: async ({ data, messageId }: { data: { content: string, file: File }, messageId: string }) => {

            console.log(data, '< data')

            const formData = new FormData();

            if (data.content) {
                formData.append('content', data.content);
            }

            if (data.file && data.file instanceof FileList && data.file.length > 0) {
                const file = data.file[0];
                formData.append('file', file);
                formData.append('fileType', determineFileType(file.name));
            }

            console.log([...formData.entries()], 'response from api call');
            const res = await $axios.put(`messages/update/${messageId}`, formData, {
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