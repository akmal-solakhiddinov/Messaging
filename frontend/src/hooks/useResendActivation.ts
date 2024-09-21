import { useToast } from "@/components/ui/use-toast"
import $axios from "@/http/axios"
import { useMutation } from "@tanstack/react-query"




const useResendActivation = () => {
    const { toast } = useToast()
    const { mutate: resendActivation, isPending: isResending, error, isError } = useMutation({
        mutationFn: async (email: string | undefined) => {
            const res = await $axios.post('auth/resend-link', { email })
            return res.data
        },

        onSuccess: () => {
            toast({
                title: 'Successfully sended.'
            })
        }
    })
    return { resendActivation, isResending, error, isError }
}

export default useResendActivation