import React, { createContext, useContext, ReactNode } from 'react';
import { UserType } from '@/lib/type';
import useFetchAuthUser from '@/hooks/useFetchAuthUser';

interface AuthContextType {
    user: UserType | null;
    isAuth: boolean;
    loading: boolean;
    isActivated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { Authuser: user, isLoadingAuth: loading } = useFetchAuthUser();

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
