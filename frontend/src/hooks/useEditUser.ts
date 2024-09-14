import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

import { useQueryClient } from '@tanstack/react-query';

const useEditUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { mutate: editUser, isPending: isEditing } = useMutation({
        mutationKey: ["user"],
        mutationFn: async (data: FormData) => {
            const res = await $axios.put('user/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            toast({
                title: 'User Updated',
                description: 'User successfully updated',
            });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error: Error) => {
            toast({
                title: 'User update error',
                description: error.message,
            });
        },
    });
    return { editUser, isEditing };
};

export default useEditUser