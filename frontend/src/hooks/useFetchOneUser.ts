import $axios from "@/http/axios"
import { useQuery } from "@tanstack/react-query"

const useFetchOneUser = (userId: string | undefined) => {
    const { data: profile, isLoading: isFetchingUser } = useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const res = await $axios.get(`user/profile/${userId}`)
            return res.data;
        }
    })
    return { profile, isFetchingUser }
}

export default useFetchOneUser