import FormMessage from "@/components/formMessage";
import RoomNavbar from "@/components/roomNavbar";
import Message from "@/components/shared/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/authContext";
import useFetchRoomMessages from "@/hooks/useFetchRoomMessages";
import useRealTimeMessages from "@/hooks/useRealTimeMessages";
import { MessageType } from "@/lib/type";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { id } = useParams<string>();
    const { user } = useAuth();
    const { user: friend, messages, isLoading } = useFetchRoomMessages(id);
    useRealTimeMessages(id);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        // <div className="flex flex-col ">
        <>
            {/* Room Navbar */}

            <div className="sticky top-0 z-10">
                <RoomNavbar friend={friend} roomId={id} />
            </div>

            {/* Messages Area */}
            <ScrollArea className="px-6 my-4 scroll-p-14 flex-1 overflow-y-auto">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    messages?.map((message: MessageType, index: number) => (
                        <Message
                            message={message}
                            key={message.id}
                            type={message.sender.id === user?.id ? 'right' : 'left'}
                            reference={messages?.length - 1 === index ? messagesEndRef : null}
                        />
                    ))
                )}
            </ScrollArea>

            {/* Message Input */}
            <div className="sticky bottom-0 bg-slate-700 p-3 px-6">
                <FormMessage receiverId={friend?.id} roomId={id} />
            </div>
        </>
    );
};

export default Room;
