import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            navigate('/registration');
        }
    }, [isAuth, navigate]);

    // Only render children if authenticated
    return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
