import $axios from "@/http/axios"
import { useQuery } from "@tanstack/react-query"

const useFetchAuthUser = () => {
    const { data: Authuser, isLoading: isLoadingAuth } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await $axios.get('user/profile')
            return res.data;
        },

    })
    return { Authuser, isLoadingAuth };
}

export default useFetchAuthUser