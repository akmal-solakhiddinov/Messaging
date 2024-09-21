import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDontAllowRoute from "@/hooks/useDontAllowRoute";
import useSendForgetPassword from "@/hooks/useSendForgetPassword";
import useSEO from "@/hooks/useSEO";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideUser, } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
    email: z.string()
})

type Schema = z.infer<typeof schema>

const ForgetPassword = () => {
    const { handleSubmit, register } = useForm<Schema>({
        resolver: zodResolver(schema)
    })

    useSEO('Forget Password')
    useDontAllowRoute()
    const { forgotPassword, isSending } = useSendForgetPassword()
    const handleSendRequest = async (data: Schema) => {
        forgotPassword(data)
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <Card className="w-full max-w-md shadow-lg border border-slate-700 rounded-xl bg-slate-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white font-semibold">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Please enter your credentials to recieve password reset link
                    </CardDescription>
                    {/* {isError && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                            <span>{error.response?.data.message}</span>
                            <button onClick={reset} className="text-white hover:text-slate-200 transition-colors">
                                <LucideX />
                            </button>
                        </div>
                    )} */}
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <form onSubmit={handleSubmit(handleSendRequest)}>
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

                        </div>
                        <Button disabled={isSending} variant={"secondary"} className="w-full mt-4">
                            Submit
                        </Button>

                        <div className="text-center mt-4 text-slate-300">
                            <Link to="/login" className="text-slate-100 hover:underline">
                                Try another way
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgetPassword;
