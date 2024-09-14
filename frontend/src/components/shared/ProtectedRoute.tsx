import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isAuth, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuth) {
            navigate('/login');
        }
    }, [isAuth, loading, navigate]);

    if (loading) return (<div className=" bg-slate-800 w-full h-full absolute inset-0 flex items-center justify-center"> <Spinner /></div>);

    return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;