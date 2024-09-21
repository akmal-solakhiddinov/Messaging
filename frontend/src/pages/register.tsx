import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import useDontAllowRoute from "@/hooks/useDontAllowRoute";
import useRegister from "@/hooks/useRegister";
import useSEO from "@/hooks/useSEO";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideX } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, } from "react-router-dom";
import { z } from "zod";





// Validation schemas
const schemaSignUp = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


type SignUpSchema = z.infer<typeof schemaSignUp>;

const Register = () => {
    const signupForm = useForm<SignUpSchema>({ resolver: zodResolver(schemaSignUp) });
    const { isAuth, isActivated, user } = useAuth();
    const { error, isError, isSuccess, register, reset, isRegistering } = useRegister()
    useDontAllowRoute()
    useSEO('Registration')


    const handleSignup = async (data: SignUpSchema) => {
        register(data)
    };



    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-800 text-slate-200">
            <Card className="w-full max-w-lg p-6 bg-slate-700 rounded-lg shadow-lg">
                <CardHeader className="text-center mb-4">
                    <CardTitle className="text-3xl font-semibold text-white">Sign Up</CardTitle>
                    <CardDescription className="text-slate-400">
                        Create your account to get started
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
                            disabled={isRegistering}
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