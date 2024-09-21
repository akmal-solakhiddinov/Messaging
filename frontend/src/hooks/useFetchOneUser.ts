import $axios from "@/http/axios"
import { UserType } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"

const useFetchOneUser = (userId: string | undefined) => {
    const { data: profile, isLoading: isFetchingUser, error, isError } = useQuery<UserType>({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const res = await $axios.get(`user/profile/${userId}`)
            return res.data;
        }
    })
    return { profile, isFetchingUser, isError, error }
}

export default useFetchOneUser