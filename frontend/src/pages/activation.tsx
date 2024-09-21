import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import useDontAllowRoute from "@/hooks/useDontAllowRoute";
import useResendActivation from "@/hooks/useResendActivation";
import useSEO from "@/hooks/useSEO";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Activation = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { error, isError, resendActivation } = useResendActivation()
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    useSEO('Activation')
    useDontAllowRoute()

    useEffect(() => {
        if (!loading && user?.isActivated) {
            navigate('/');
        }
    }, [user?.isActivated, navigate, loading]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const interval = setInterval(() => {
                setResendCooldown((prevCooldown) => prevCooldown - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setIsResendDisabled(false);
        }
    }, [resendCooldown]);

    const handleResendLink = async () => {
        try {
            resendActivation(user?.email)
            setResendCooldown(60);
            setIsResendDisabled(true);
        } catch (error) {
            console.error("Failed to resend activation link", error);
        }
    };

    if (loading) return <Spinner />



    return (
        <div className="w-full h-screen bg-slate-800 flex items-center justify-center  flex-col gap-4 p-8">
            {isError && (
                <div className="flex items-center justify-between gap-2 px-4 py-2 mt-4 bg-red-600 text-white rounded-md shadow-md">
                    <span>
                        {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-expect-error
                            error.response?.data.message
                        }
                    </span>

                </div>
            )}
            {!user?.isActivated ? (
                <div className="text-center">
                    <p className="mb-3 text-lg font-mono font-medium">
                        Your account has not been activated yet. Please activate it. If you have not received the activation link, check your registered email <strong className="text-slate-500">{user?.email}</strong> or resend the activation link.
                    </p>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Button
                            onClick={handleResendLink}
                            disabled={isResendDisabled}
                        >
                            {isResendDisabled ? `Resend link in ${resendCooldown}s` : 'Resend link'}
                        </Button>
                    </div>
                </div>
            ) : (
                <p>Redirecting...</p>
            )}
        </div>
    );
};

export default Activation;
