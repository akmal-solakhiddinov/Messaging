import $axios from "@/http/axios";
import { useQuery } from "@tanstack/react-query";

const useFetchAuthUser = () => {
    const { data: Authuser, isLoading: isLoadingAuth, isError, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await $axios.get('user/profile');
            return res.data;
        },

        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return { Authuser, isLoadingAuth, isError, error };
};

export default useFetchAuthUser;
