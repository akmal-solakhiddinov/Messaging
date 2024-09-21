import { useToast } from "@/components/ui/use-toast";
import $axios from "@/http/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    email: string;
    password: string;
}

const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast()

    const { mutate: login, isPending: isLogining, error, isError, reset, isSuccess } = useMutation({
        mutationFn: async (data: LoginProps) => {
            const res = await $axios.post('/auth/login', data);
            localStorage.setItem('accessToken', res.data.accessToken);
            return res.data;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user?.user);
            toast({
                title: "Successfully login",
                description: `${user.fullName} successfully login`
            })
            navigate('/', { replace: true });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            return error.response?.data.message;
        }
    });

    return { login, isLogining, isError, error, reset, isSuccess };
};

export default useLogin;
