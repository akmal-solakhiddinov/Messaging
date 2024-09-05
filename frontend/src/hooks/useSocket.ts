import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';

let socket;

const useSocket = () => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (user?.id) {
            socket = io('http://localhost:4000', {
                query: { userId: user.id }
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                socket.emit('joinRoom', user.id)
                setIsConnected(true);
            });

            socket.on('notification', notification => {
                console.log('Notification received:', notification);
                const parsedNotification = JSON.parse(notification);
                console.log('Parsed notification:', parsedNotification);
            });


            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user?.id]);



    return { socket, isConnected };
};

export default useSocket;