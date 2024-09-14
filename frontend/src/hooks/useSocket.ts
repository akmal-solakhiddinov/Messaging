import { io, Socket } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useLocation } from 'react-router-dom';
import { MessageType } from '@/lib/type';
import { useToast } from '@/components/ui/use-toast';
import useRoomFetch from './useRoomFetch';


let socket: Socket;

const useSocket = () => {
    const { user } = useAuth();
    const { toast } = useToast()
    const [isConnected, setIsConnected] = useState(false);
    const { pathname } = useLocation();;
    const { rooms } = useRoomFetch()

    const allRooms = useMemo(() => rooms.map(r => r.id), [rooms]);

    const handleRoomMessage = (message: MessageType) => {
        const roomId = pathname.split('/')[2]
        // if (roomId == message.chatId) return
        if (roomId !== message.chatId) {
            toast({
                title: 'New Message',
                description: message.content
            })
            console.log(message);
        }

        return
    }



    useEffect(() => {
        if (user?.id) {
            socket = io(import.meta.env.VITE_BASE_URL, {
                query: { userId: user.id }
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                socket.emit('joinRoom', [user.id, ...allRooms])
                setIsConnected(true);
            });

            socket.on('notification', notification => {
                console.log('Notification received:', notification);
                const parsedNotification = JSON.parse(notification);
                console.log('Parsed notification:', parsedNotification);
            });


            socket.on('message', message => {
                handleRoomMessage(message)
            })



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