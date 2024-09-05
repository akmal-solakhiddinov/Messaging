import $axios from "@/http/axios"
import { RequestType } from "@/lib/type";
import { useQuery } from "@tanstack/react-query"

const useGetAllRequests = () => {
    const { data: friendRequests = [], isLoading: isFetchingRequests } = useQuery<RequestType[]>({
        queryKey: ["friendRequests"],
        queryFn: async () => {
            const res = await $axios.get('requests/friend/get-all');
            console.log(res);
            return res.data;
        }
    });

    return { friendRequests, isFetchingRequests }
}

export default useGetAllRequests