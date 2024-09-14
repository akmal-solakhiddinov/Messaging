import { FaFile } from "react-icons/fa";
import React from "react";
import { MessageType } from "@/lib/type";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ModalFormEditMessage from "./modalFormEditMessage";
import ModalDeleteItem from "./modalDeleteItem";
import { useAuth } from "@/context/authContext";
import { CiMenuKebab } from "react-icons/ci";

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
};

interface MessageProps {
    message: MessageType,
    type: string,
    reference: React.RefObject<HTMLDivElement> | null;
}

const Message: React.FC<MessageProps> = ({ message, type, reference }) => {
    const { user } = useAuth()
    const renderFileContent = () => {
        if (!message.file) {
            return null; // Or a default fallback if needed
        }
        switch (message.fileType) {
            case "IMAGE":
                return <img src={message.file} alt="Image" />;
            case "VIDEO":
                return <video src={message.file} controls className="aspect-square" />;
            case "AUDIO":
                return <audio src={message.file} controls />;
            case "FILE":
                return (
                    <a href={message.file} download className="flex flex-row gap-3 items-center justify-between">
                        <FaFile /> Download File
                    </a>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex ${type === "right" ? "justify-end" : "justify-start"} mb-4`} ref={reference}>
            <div className={`max-w-60 shadow-xl overflow-hidden w-max p-[3px] min-w-20 rounded-lg ${type === "right" ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-50"}`}>

                {message.file && message.fileType ? (
                    <>
                        <div>{renderFileContent()}</div>
                        {message.content && <p className="p-2">{message.content}</p>}
                    </>
                ) : (
                    <p>{message.content}</p>
                )}
                <div className="flex flex-row gap-4 items-center justify-between">
                    <span className="text-xs mt-2 block text-right opacity-75">{formatTime(message.created)}
                    </span>

                    {
                        user?.id === message.sender.id && (<span>
                            <Popover>
                                <PopoverTrigger>
                                    <CiMenuKebab size={12} />
                                </PopoverTrigger>
                                <PopoverContent className="max-w-min top-0 right-1/4 mx-10 flex flex-col gap-3">
                                    <ModalFormEditMessage message={message} />
                                    <ModalDeleteItem text="Do you realy want to delete this message" itemLink={`messages/delete/${message.id}`} />
                                </PopoverContent>
                            </Popover>
                        </span>)
                    }

                </div>
            </div>
        </div>
    );
};

export default Message;
