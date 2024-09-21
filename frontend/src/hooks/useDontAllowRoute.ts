import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useDontAllowRoute = () => {
    const { isAuth, isActivated } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuth && isActivated) navigate('/', { replace: true });
    }, [isAuth, navigate, isActivated]);
    return null
}

export default useDontAllowRoute