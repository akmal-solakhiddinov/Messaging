import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import $axios from '../http/axios';
import { UserType } from '@/lib/type';

interface AuthContextType {
    user: UserType | null;
    isAuth: boolean;
    loading: boolean;
    error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Function to fetch user profile
    const fetchUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token'); // Fetch token inside function to ensure it's always current
            if (!token) {
                setIsAuth(false);
                setUser(null);
                return;
            }
            const req = await $axios.get('user/profile');
            if (!req.data) {
                throw new Error('Failed to fetch user data');
            }
            setUser(req.data);
            setIsAuth(true);
        } catch (error: any) {
            setIsAuth(false);
            setUser(null);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to fetch user data');
            } else {
                setError(error.message || 'An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch user when token changes
    useEffect(() => {
        fetchUser();
    }, []);

    // Watch for token changes and re-validate user
    useEffect(() => {
        const handleStorageChange = () => {
            fetchUser();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, isAuth }}>
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
