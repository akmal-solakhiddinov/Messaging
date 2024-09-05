import { toast, useToast } from '@/components/ui/use-toast';
import useSocket from '@/hooks/useSocket';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

interface SystemContextType {
    loading: boolean;
    error: string;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const parmas = useLocation();
    const { isConnected, socket } = useSocket()
    const { toast } = useToast()
    useEffect(() => {
        if (isConnected) {
            socket.on('notification', notification => {
                console.log(notification)
                toast({

                    title: notification.title,
                    description: notification.description
                })
            })
        }

    }, [])

    return (
        <SystemContext.Provider value={{}}>
            {children}
        </SystemContext.Provider>
    );
};

export default SystemProvider;

export const useSystem = (): SystemContextType => {
    const context = useContext(SystemContext);
    if (context === undefined) {
        throw new Error('usuSystem must be used within an SystemProvider');
    }
    return context;
};
