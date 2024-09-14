import React, { createContext, useContext, useEffect, ReactNode } from 'react';
// import $axios from '../http/axios';
import { UserType } from '@/lib/type';
import useFetchAuthUser from '@/hooks/useFetchAuthUser';

interface AuthContextType {
    user: UserType | null;
    isAuth: boolean;
    loading: boolean;
    // error: string;
    // fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const [user, setUser] = useState<UserType | null>(null);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string>('');
    const { Authuser: user, isLoadingAuth: loading } = useFetchAuthUser()

    // const fetchUser = async () => {
    // setLoading(true);
    // try {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         throw new Error('No token found');
    //     }
    //     const response = await $axios.get('user/profile');
    //     setUser(response.data);
    // } catch (error: any) {
    //     setUser(null);
    //     setError(error.response?.data?.message || error.message || 'An error occurred');
    // } finally {
    //     setLoading(false);
    // }
    // };

    // useEffect(() => {
    //     //fetchUser();
    //     console.log(user, loading)


    // }, [user, loading]);

    useEffect(() => {
        const handleStorageChange = () => {
            // fetchUser();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuth: !!user, loading, }}>
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


