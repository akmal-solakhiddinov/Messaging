import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"


interface Props {
    email: string
}

const useSendForgetPassword = () => {
    const { toast } = useToast()
    const { mutate: forgotPassword, isPending: isSending } = useMutation({
        mutationFn: async (data: Props) => {
            const res = await $axios.post('auth/forget-password', data)
            return res.data
        },
        onSuccess: () => {
            toast({
                title: 'Request Successfully sended: '
            })
        }
    })
    return { forgotPassword, isSending }
}

export default useSendForgetPassword