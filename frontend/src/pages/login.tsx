import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import $axios from "@/http/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLock, LucideUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";


const schemaLogin = z.object({
    email: z.string().min(3).email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof schemaLogin>;

const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

const Login = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const { handleSubmit, register, formState: { isSubmitting } } = useForm<LoginSchema>({ resolver: zodResolver(schemaLogin) });
    const [error, setError] = useState<string>('')


    const handleLogin = async (data: LoginSchema) => {
        setError('');
        try {
            const res = await $axios.post('/auth/login', data);
            if (res.data && res.data.token) {
                saveToken(res.data.token);
                // fetchUser();
            } else {
                setError(res.data.message || 'Unexpected response from the server.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred during login.');
            console.error('Login Error:', error.response?.data?.message || error.message);
        }
    };



    useEffect(() => {
        if (isAuth) navigate('/');
    }, [isAuth, navigate]);



    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <Card className="w-full max-w-md shadow-lg border border-slate-700 rounded-xl bg-slate-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white font-semibold">Welcome Back</CardTitle>
                    <CardDescription className="text-slate-400">Please enter your
                        credentials to log in</CardDescription>
                    {error && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                            <span>{error}</span>
                            <button
                                onClick={() => setError('')}
                                className="text-white hover:text-slate-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-slate-400">Username</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                    <LucideUser className="absolute left-3 top-3 text-slate-500" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="text-slate-400">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="pl-10"
                                        {...register('password')}
                                    />
                                    <LucideLock className="absolute left-3 top-3 text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <Button disabled={isSubmitting} variant={"secondary"} className="w-full mt-4">
                            Sign In
                        </Button>

                        <div className="text-center mt-4 text-slate-300">
                            Don’t have an account? {" "}
                            <Link to="/register" className="text-slate-100 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login