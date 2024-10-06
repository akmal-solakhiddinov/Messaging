import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Props {
    to?: string
}

const BackButton: React.FC<Props> = ({ to }) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        if (to) {
            navigate(to, { replace: true });
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        navigate(-1, { replace: true });
    };

    return (
        <div className="w-full flex justify-start">
            <Button
                onClick={handleNavigate}
                variant="ghost"
                className="p-2 m-0 flex items-center"
                aria-label="Go back"
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default BackButton;
