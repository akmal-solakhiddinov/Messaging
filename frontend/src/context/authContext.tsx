import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import $axios from '../http/axios';
import { UserType } from '@/lib/type';

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const req = await $axios.get('user/profile')

                if (!req.data) {
                    throw new Error(req.data.message)
                }

                setUser(req.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setError('')
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
