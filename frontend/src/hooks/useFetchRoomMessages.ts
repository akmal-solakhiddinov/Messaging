import { useQuery } from "@tanstack/react-query";
import $axios from "@/http/axios";
// import useSocket from "@/hooks/useSocket";
// import { useEffect, useCallback } from "react";
import { MessageType, UserType } from "@/lib/type";

interface RoomMessagesData {
    user: UserType;
    messages: MessageType[];
}

const useFetchRoomMessages = (id: string | undefined) => {
    // const queryClient = useQueryClient();
    // const { isConnected, socket } = useSocket();

    const { data, isLoading, error } = useQuery<RoomMessagesData>({
        queryKey: ["messages", id],
        queryFn: async () => {
            if (!id) throw new Error("Room ID is required");
            const response = await $axios.get(`rooms/room-messages/${id}`);
            return response.data;
        },
    });

    const { user, messages } = data || { user: null, messages: [] };

    /*    const handleNewMessage = useCallback(
           (newMessage: MessageType) => {
               queryClient.setQueryData(["messages", id], (oldData: RoomMessagesData | undefined) => {
                   const updatedMessages = [...(oldData?.messages || []), newMessage];
                   return { ...oldData, messages: updatedMessages };
               });
           },
           [queryClient, id]
       );
   
       useEffect(() => {
           if (isConnected && id) {
               socket.on('message', handleNewMessage);
   
               return () => {
                   socket.off('message', handleNewMessage);
               };
           }
       }, [isConnected, id]); */

    return { data, user, messages, isLoading, error };
};

export default useFetchRoomMessages;
