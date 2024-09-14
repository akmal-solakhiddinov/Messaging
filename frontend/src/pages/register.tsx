import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import $axios from "@/http/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";



const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

// Validation schemas
const schemaSignUp = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


type SignUpSchema = z.infer<typeof schemaSignUp>;

const Register = () => {
    const signupForm = useForm<SignUpSchema>({ resolver: zodResolver(schemaSignUp) });
    const { isAuth,  } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string>('')


    const handleSignup = async (data: SignUpSchema) => {
        try {
            const res = await $axios.post('/auth/register', data);
            if (res.data && res.data.token) {
                saveToken(res.data.token);
                // fetchUser();
            } else {
                setError(res.data.message || 'Unexpected response from the server.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred during register.');
            console.error('Sign up Error:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (isAuth) navigate('/');
    }, [isAuth, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-800 text-slate-200">
            <Card className="w-full max-w-lg p-6 bg-slate-700 rounded-lg shadow-lg">
                <CardHeader className="text-center mb-4">
                    <CardTitle className="text-3xl font-semibold text-white">Sign Up</CardTitle>
                    <CardDescription className="text-slate-400">
                        Create your account to get started
                    </CardDescription>
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
                <CardContent>
                    <form
                        onSubmit={signupForm.handleSubmit(handleSignup)}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="signup-fullName" className="text-slate-300">
                                Full Name
                            </Label>
                            <Input
                                id="signup-fullName"
                                type="text"
                                placeholder="Enter your full name"
                                className="bg-slate-600 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-slate-400"
                                {...signupForm.register('fullName')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="signup-email" className="text-slate-300">
                                Email
                            </Label>
                            <Input
                                id="signup-email"
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-600 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-slate-400"
                                {...signupForm.register('email')}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="signup-password" className="text-slate-300">
                                Password
                            </Label>
                            <Input
                                id="signup-password"
                                type="password"
                                placeholder="Enter your password"
                                className="bg-slate-600 text-slate-100 border border-slate-500 focus:ring-2 focus:ring-slate-400"
                                {...signupForm.register('password')}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-lg shadow focus:ring-2 focus:ring-slate-400 transition-colors"
                        >
                            Sign Up
                        </Button>

                        <div className="text-center mt-4 text-slate-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-slate-100 hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Register