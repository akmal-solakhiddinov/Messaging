import { useEffect, useCallback } from 'react';
import useSocket from '@/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';

const useRealTimeMessages = (roomId: string) => {
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const handleNewMessage = useCallback(
        (newMessage) => {
            console.log('New message received:', newMessage);

            queryClient.setQueryData(['messages', roomId], (oldData) => ({
                ...oldData,
                messages: [...(oldData?.messages || []), newMessage],
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
