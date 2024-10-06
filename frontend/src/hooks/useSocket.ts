import { io, Socket } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useLocation } from 'react-router-dom';
// import { MessageType } from '@/lib/type';
import { useToast } from '@/components/ui/use-toast';
import useRoomFetch from './useRoomFetch';


let socket: Socket;

const useSocket = () => {
    const { isAuth, user, isActivated } = useAuth();
    const { toast } = useToast()
    const [isConnected, setIsConnected] = useState(false);
    const { pathname } = useLocation();;
    const { rooms } = useRoomFetch()


    const allRooms = useMemo(() => rooms.map(r => r.id), [rooms]);


    useEffect(() => {
        if (isAuth && isActivated) {
            const socketUrl = import.meta.env.VITE_BASE_URL;
            // console.log('Socket URL:', socketUrl);

            socket = io(socketUrl, {
                query: { userId: user?.id }
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                socket.emit('joinRoom', [user?.id, ...allRooms]);

                setIsConnected(true);
            });

            socket.on('notification', (notification) => {
                const parsedNotification = JSON.parse(notification);
                console.log('Parsed notification:', parsedNotification);
            });

            socket.on('message', (message) => {
                const roomId = pathname.split('/')[2];

                if (roomId === message.chatId) {
                    return
                } else {
                    toast({
                        title: 'New Message',
                        description: message.content || 'No content',
                    });
                }
            });


            /*             socket.on("offer", (message) => {
                            console.log("Offer received: ", message);
                        });
             */
            // socket.on("answer", (message) => {
            // console.log("Answer received: ", message);
            // });
            // 
            socket.on("candidate", (message) => {
                console.log("ICE candidate received: ", message);
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
        }
    }, [user?.id, toast, pathname, isAuth, allRooms, isActivated]);

    return { socket, isConnected };
};



export default useSocket;
