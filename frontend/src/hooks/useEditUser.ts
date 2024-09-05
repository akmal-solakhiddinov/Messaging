import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"

const useEditUser = () => {
    const { mutate: editUser, isPending: isEditing } = useMutation({
        mutationKey: ["user"],
        mutationFn: async (data) => {
            const res = await $axios.put('user/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            return res.data;
        }
    })
    return { editUser, isEditing };
}

export default useEditUser