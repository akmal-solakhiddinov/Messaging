



import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios";
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";


interface Props {
    password: string;
    checkPassword: string;
    token: string | undefined;
}

const useUpdatePassword = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { mutate: updatePassword, isPending: isUpdating, error, isError, reset, } = useMutation({
        mutationFn: async (data: Props) => {
            const res = await $axios.put('auth/recovery-account', data)
            return res.data
        },

        onSuccess: () => {
            toast({
                title: 'Successfully updated',
                description: 'Password successfully updated'
            })
            navigate('/login', { replace: true })
        }
    })
    return { updatePassword, isUpdating, error, isError, reset, }
}

export default useUpdatePassword


