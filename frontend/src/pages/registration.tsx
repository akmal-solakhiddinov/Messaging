import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import $axios from '../http/axios'
const schemaSignUp = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const schemaLogin = z.object({
    email: z.string().min(3).email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


type SignUpSchema = z.infer<typeof schemaSignUp>;
type LoginSchema = z.infer<typeof schemaLogin>;

const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

const Registration = () => {
    const loginForm = useForm<LoginSchema>({
        resolver: zodResolver(schemaLogin),
    });

    const signupForm = useForm<SignUpSchema>({
        resolver: zodResolver(schemaSignUp)
    });

    const handleLogin = async (data: LoginSchema) => {

        try {
            const response = await $axios.post('/auth/login', data);

            if (response.data) {
                console.log('Login successful:', response.data);
                localStorage.setItem('token', response.data.token);
            } else {
                throw new Error('Login failed: No data received');
            }

        } catch (error: any) {
            if (error.response && error.response.data) {
                console.log('Error:', error.response.data.message);
            } else {
                console.log('Error:', error.message);
            }
        }
    };


    const handleSignup = async (data: SignUpSchema) => {
        console.log('Signup Data:', data);

        try {
            const response = await $axios.post('/auth/register', data);

            if (response.data) {
                console.log('Signup successful:', response.data);
                saveToken(response.data.token);
            } else {
                throw new Error('Signup failed: No data received');
            }
        } catch (error: any) {
            console.error('Signup Error:', error.response?.data?.message || error.message);
        }
    };


    return (
        <div className="flex h-full min-h-screen  bg-slate-800 text-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full px-11 py-11 gap-8">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-6 p-8 bg-slate-700 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold text-center">Login</h1>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                        <Input
                            id="login-email"
                            type="email"
                            placeholder="Email"
                            className="bg-slate-600 text-slate-100 border-slate-500 focus:ring-slate-400"
                            {...loginForm.register("email")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                        <Input
                            id="login-password"
                            type="password"
                            placeholder="Password"
                            className="bg-slate-600 text-slate-100 border-slate-500 focus:ring-slate-400"
                            {...loginForm.register("password")}
                        />
                    </div>

                    <Button type="submit" className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-lg shadow focus:ring-slate-400">Login</Button>
                </form>

                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="flex flex-col gap-6 p-8 bg-slate-700 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold text-center">Sign Up</h1>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="signup-fullName" className="text-slate-300">Full Name</Label>
                        <Input
                            id="signup-fullName"
                            type="text"
                            placeholder="Full Name"
                            className="bg-slate-600 text-slate-100 border-slate-500 focus:ring-slate-400"
                            {...signupForm.register("fullName")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                        <Input
                            id="signup-email"
                            type="email"
                            placeholder="Email"
                            className="bg-slate-600 text-slate-100 border-slate-500 focus:ring-slate-400"
                            {...signupForm.register("email")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                        <Input
                            id="signup-password"
                            type="password"
                            placeholder="Password"
                            className="bg-slate-600 text-slate-100 border-slate-500 focus:ring-slate-400"
                            {...signupForm.register("password")}
                        />
                    </div>

                    <Button type="submit" className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-lg shadow focus:ring-slate-400">Sign Up</Button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
