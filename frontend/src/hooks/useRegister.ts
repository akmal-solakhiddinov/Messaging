import { useToast } from "@/components/ui/use-toast";
import $axios from "@/http/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
    fullName: string;
    email: string;
    password: string;
}

const useRegister = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast()
    const { mutate: register, isPending: isRegistering, error, isError, reset, isSuccess } = useMutation({
        mutationFn: async (data: RegisterProps) => {
            const res = await $axios.post('/auth/register', data);
            localStorage.setItem('accessToken', res.data.accessToken);
            return res.data;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user?.user);
            toast({
                title: "Successfully login",
                description: `successfully login`
            })
            navigate('/activation', { replace: true });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            return error.response?.data.message;
        }
    });

    return { register, isRegistering, isError, error, reset, isSuccess };
};

export default useRegister;
