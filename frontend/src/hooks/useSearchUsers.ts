import $axios from "@/http/axios";
import { useQuery } from "@tanstack/react-query";

const useSearchUsers = (value: string) => {
    const { data: result, isLoading: isSearching } = useQuery({
        queryKey: ["profiles", value],  
        queryFn: async () => {
            const res = await $axios.post('user/search', { query: value });
            return res.data;
        },
        enabled: !!value,
    });

    return { result, isSearching };
};

export default useSearchUsers;
