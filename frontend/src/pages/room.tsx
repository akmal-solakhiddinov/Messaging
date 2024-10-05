import FormMessage from "@/components/formMessage";
import RoomNavbar from "@/components/roomNavbar";
import Message from "@/components/shared/message";
import Spinner from "@/components/shared/Spinner";
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
        <div className="min-h-screen flex flex-col">

            {/* Room Navbar (Sticky) */}
            <div className="sticky top-0 z-10">
                <RoomNavbar friend={friend} roomId={id} />
            </div>

            {/* Message Scroll Area */}
            <div className="flex-grow">
                <ScrollArea className="px-6 my-4 scroll-p-14  h-[80vh] overflow-y-auto   ">
                    {isLoading ? (
                        <Spinner />
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
                    {!messages?.length && (
                        <div className="text-center text-white py-6">
                            Room createred, No messages yet.
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Form Message (Sticky at the bottom) */}
            <div className="sticky bottom-0 bg-slate-700 p-3 px-6">
                <FormMessage receiverId={friend?.id} roomId={id} />
            </div>
        </div>
    );
};

export default Room;
