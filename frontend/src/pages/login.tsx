import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import useDontAllowRoute from "@/hooks/useDontAllowRoute";
import useLogin from "@/hooks/useLogin";
import useSEO from "@/hooks/useSEO";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLock, LucideUser, LucideX } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, } from "react-router-dom";
import { z } from "zod";

const schemaLogin = z.object({
    email: z.string().min(3).email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof schemaLogin>;

const Login = () => {
    const { isAuth, user, isActivated } = useAuth();
    useDontAllowRoute()
    const { handleSubmit, register } = useForm<LoginSchema>({
        resolver: zodResolver(schemaLogin),
    });
    const { login, error, isError, reset, isLogining, isSuccess } = useLogin();
    useSEO('Login')


    const handleLogin = async (data: LoginSchema) => {
        login(data);
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <Card className="w-full max-w-md shadow-lg border border-slate-700 rounded-xl bg-slate-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white font-semibold">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Please enter your credentials to log in
                    </CardDescription>
                    {isError && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                            <span>{error.response?.data.message}</span>
                            <button onClick={reset} className="text-white hover:text-slate-200 transition-colors">
                                <LucideX />
                            </button>
                        </div>
                    )}

                    {isSuccess || (isAuth && !isActivated) && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                            <span>
                                Check your email we have sent you <strong>{user?.email}</strong> an activation link, link <strong>expires</strong> in <strong>5 minutes</strong>
                            </span>
                            <button onClick={reset} className="text-white hover:text-slate-200 transition-colors">
                                <LucideX />
                            </button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-slate-400">Email</Label>
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
                                <Link to="/forgot-password" className="text-slate-300 hover:underline text-sm">
                                    Forgot password
                                </Link>
                            </div>
                        </div>
                        <Button disabled={isLogining} variant={"secondary"} className="w-full mt-4">
                            Sign In
                        </Button>

                        <div className="text-center mt-4 text-slate-300">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-slate-100 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
