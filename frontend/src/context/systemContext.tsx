// import { useToast } from '@/components/ui/use-toast';
// import useSocket from '@/hooks/useSocket';
import React, { createContext, useContext, ReactNode, useState, } from 'react';
// import { useLocation } from 'react-router-dom';
// import { string } from 'zod';
// import { useLocation, } from 'react-router-dom';

interface SystemContextType {
    sheet: boolean;
    friend: string,
    setSheet: (value: boolean) => void;
    setFriend: (value: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const { pathname } = useLocation()
    const [sheet, setSheet] = useState(false);
    const [friend, setFriend] = useState('')
    const value = { sheet, setSheet, friend, setFriend }



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