import { useToast } from "@/components/ui/use-toast";
import $axios from "@/http/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRefreshToken = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { mutate: refreshToken, isPending: isLogining, error, isError, reset, isSuccess } = useMutation({
        mutationFn: async (data: object) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const res = await $axios.get('/auth/refresh', data);
                localStorage.setItem('accessToken', res.data.accessToken);
                return res.data;
            }
            // throw new Error('No access token found'); // Prevent unnecessary requests
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user?.user);
            toast({
                title: "Successfully logged in",
                description: `${user.fullName} successfully logged in`
            });
        },
        // onError: (error: any) => {
        // toast({
        // title: "Error",
        // description: error.response?.data.message || "An error occurred",
        // variant: "destructive",
        // });
        //        }
    });

    return { refreshToken, isLogining, isError, error, reset, isSuccess };
};

export default useRefreshToken;
