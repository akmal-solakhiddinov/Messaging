import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDontAllowRoute from "@/hooks/useDontAllowRoute";
import useSEO from "@/hooks/useSEO";
import useUpdatePassword from "@/hooks/useUpdatePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLock, LucideX, } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom"
import { z } from "zod";

const schema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    checkPassword: z.string().min(6, 'Password must be at least 6 characters'),

}).refine(data => {
    if (data.password && data.checkPassword && data.password !== data.checkPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match.",
    path: ["checkPassword"]
})

type Schema = z.infer<typeof schema>;



const UpdatePassword = () => {
    useDontAllowRoute()
    useSEO('Password reset')

    const { token } = useParams();
    const { error, isError, isUpdating, reset, updatePassword } = useUpdatePassword()
    const { handleSubmit, register, formState: { errors: passwordError, } } = useForm<Schema>({
        resolver: zodResolver(schema),
    })

    const handlSendRequest = async (data: Schema) => {
        updatePassword({ ...data, token })
    }

    console.log(passwordError)

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
                    {isError && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">

                            <span>
                                {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    error.response?.data.message
                                }
                            </span>
                            <button onClick={reset} className="text-white hover:text-slate-200 transition-colors">
                                <LucideX />
                            </button>
                        </div>
                    )}
                    {passwordError.checkPassword?.message && (
                        <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                            <span>{passwordError.checkPassword.message}</span>
                            <button className="text-white hover:text-slate-200 transition-colors">
                                <LucideX />
                            </button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <form onSubmit={handleSubmit(handlSendRequest)}>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="text-slate-400">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10"
                                        {...register('password')}
                                    />
                                    <LucideLock className="absolute left-3 top-3 text-slate-500" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="checkPassword" className="text-slate-400">Repeat Password</Label>
                                <div className="relative">
                                    <Input
                                        id="checkPassword"
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10"
                                        {...register('checkPassword')}
                                    />
                                    <LucideLock className="absolute left-3 top-3 text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <Button disabled={isUpdating} variant={"secondary"} className="w-full mt-4">
                            Submit
                        </Button>

                    </form>
                    <div className="text-center mt-4 text-slate-300">
                        <Link to="/login" className="text-slate-100 hover:underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdatePassword