import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isAuth, loading, isActivated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuth) {
            navigate('/login', { replace: true });
        }
    }, [isAuth, loading, navigate]);

    if (loading) return <Spinner />;
    if (isAuth && !isActivated) navigate('/activation')
    return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
