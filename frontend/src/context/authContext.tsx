import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { UserType } from '@/lib/type';
import useFetchAuthUser from '@/hooks/useFetchAuthUser';
import useRefreshToken from '@/hooks/useRefresh';

interface AuthContextType {
    user: UserType | null;
    isAuth: boolean;
    loading: boolean;
    isActivated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { Authuser: user, isLoadingAuth: loading } = useFetchAuthUser();
    const { refreshToken } = useRefreshToken()

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            refreshToken();
        }
    }, [refreshToken]);

    const isActivated = user?.isActivated || false;

    return (
        <AuthContext.Provider value={{ user, isAuth: !!user, loading, isActivated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
