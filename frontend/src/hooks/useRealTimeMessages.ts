import { useEffect, useCallback } from 'react';
import useSocket from '@/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import { MessageType, UserType } from '@/lib/type';

interface ChatData {
    id: string;
    user: UserType;
    messages: MessageType[];
}

const useRealTimeMessages = (roomId: string | undefined) => {
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const handleNewMessage = useCallback(
        (newMessage: MessageType) => {
            queryClient.setQueryData(['messages', roomId], (oldData: ChatData) => ({
                ...oldData,
                messages: [...(oldData?.messages || []), newMessage]
            }));

        },
        [queryClient, roomId]
    );

    useEffect(() => {
        if (isConnected) {
            socket.emit('joinRoom', roomId)
            socket.on('message', handleNewMessage); // Changed to 'message'

            return () => {
                socket.off('message', handleNewMessage); // Changed to 'message'
            };
        }
    }, [handleNewMessage, isConnected, socket, roomId]);

    return null; // This hook doesn't need to return anything
};

export default useRealTimeMessages;
