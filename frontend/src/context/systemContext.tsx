// import { useToast } from '@/components/ui/use-toast';
// import useSocket from '@/hooks/useSocket';
import React, { createContext, useContext, ReactNode, } from 'react';
// import { string } from 'zod';
// import { useLocation, } from 'react-router-dom';

interface SystemContextType {
    loading: boolean;
    error: string;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const loading = true
    const error = 'sal'
    // const parmas = useLocation();
    // const { isConnected, socket } = useSocket()
    // const { toast } = useToast()
    // useEffect(() => {
    //     if (isConnected) {
    //         socket.on('notification', notification => {
    //             console.log(notification)
    //             toast({

    //                 title: notification.title,
    //                 description: notification.description
    //             })
    //         })
    //     }

    // }, [])

    const value = { loading, error }

    return (
        <SystemContext.Provider value={value}>
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
