import { useAuth } from "@/context/authContext";
import $axios from "@/http/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth()
    const { mutate: logout, isPending: isLoading } = useMutation({
        mutationFn: async () => {
            await $axios.post('auth/logout', { userId: user?.id })
            localStorage.removeItem('accessToken');
            queryClient.clear();
        },
        onSuccess: () => {
            navigate("/login", { replace: true });
            window.location.reload()
        },
        onError: (error) => {
            console.error("Logout failed", error);
        }
    });

    return { logout, isLoading };
}


