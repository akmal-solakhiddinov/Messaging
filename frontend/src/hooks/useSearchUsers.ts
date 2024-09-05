import $axios from "@/http/axios";
import { useQuery } from "@tanstack/react-query";

const useSearchUsers = (value: string) => {
    const { data: result, isLoading: isSearching } = useQuery({
        queryKey: ["profiles", value],  // Include `value` in the query key
        queryFn: async () => {
            const res = await $axios.post('user/search', { query: value });  // Sending value in the request body
            return res.data;
        },
        enabled: !!value,  // Only run the query if `value` is not empty
    });

    return { result, isSearching };
};

export default useSearchUsers;
