import { io, Socket } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useLocation } from 'react-router-dom';
// import { MessageType } from '@/lib/type';
import { useToast } from '@/components/ui/use-toast';
import useRoomFetch from './useRoomFetch';


let socket: Socket;

const useSocket = () => {
    const { isAuth, user } = useAuth();
    const { toast } = useToast()
    const [isConnected, setIsConnected] = useState(false);
    const { pathname } = useLocation();;
    const { rooms } = useRoomFetch()

    const allRooms = useMemo(() => rooms.map(r => r.id), [rooms]);


useEffect(() => {
    // if (isAuth) {
        const socketUrl = import.meta.env.VITE_BASE_URL;
        console.log('Socket URL:', socketUrl);

        socket = io(socketUrl, {
            query: { userId: user?.id },
            autoConnect: false,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('joinRoom', [user?.id, ...allRooms]);
            console.log('User joined rooms:', [user?.id, ...allRooms]);

            setIsConnected(true);
        });

        socket.on('notification', (notification) => {
            const parsedNotification = JSON.parse(notification);
            console.log('Parsed notification:', parsedNotification);
        });

        socket.on('message', (message) => {
            const roomId = pathname.split('/')[2];
            console.log('Message chatId:', message.chatId);

            if (roomId !== message.chatId) {
                toast({
                    title: 'New Message',
                    description: message.content || 'No content',
                });
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('connect_failed', () => {
            console.error('Socket connection failed');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    // }
}, [user?.id, allRooms, toast, pathname, isAuth]);

    return { socket, isConnected };
};



export default useSocket;
