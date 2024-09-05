import { File, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import $axios from "@/http/axios";
import { determineFileType } from "@/lib/helper";
// import useSocket from "@/hooks/useSocket";
// import { useAuth } from "@/context/authContext";

// Zod validation schema
const messageSchema = z.object({
    content: z.string().optional(),
    file: z.union([z.string(), z.instanceof(FileList)]).optional(),
}).refine(data => data.content || (data.file && data.file.length > 0), {
    message: "Either a message content or a file is required",
    path: ["content"],
});

type FormMessageProps = {
    receiverId: string | undefined;
    roomId: string | undefined;
};

type MessageSchema = z.infer<typeof messageSchema>;

const FormMessage: React.FC<FormMessageProps> = ({ receiverId, roomId }) => {
    const { handleSubmit, reset, register, formState: { isSubmitting, errors } } = useForm<MessageSchema>({
        resolver: zodResolver(messageSchema),
    });
    // const { isConnected, socket } = useSocket();
    // const { user } = useAuth();

    const onSubmit = async (data: MessageSchema) => {
        try {
            const formData = new FormData();
            // formData.append('receiverId', receiverId);
            // formData.append('roomId', roomId || '');

            if (data.content) {
                formData.append('content', data.content);
            }

            if (data.file && data.file instanceof FileList && data.file.length > 0) {
                const file = data.file[0];
                formData.append('file', file);
                formData.append('fileType', determineFileType(file.name));
            }

            await $axios.post(`/messages/send/${roomId}/${receiverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // const socketMessage = { ...res.data, sender: { id: user?.id } };

            // if (isConnected) {
            //     socket.emit('sendMessage', roomId, socketMessage);
            // }

            reset();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row w-full items-center justify-between">
            <label htmlFor="input-file" className="text-white text-center rounded-full w-10 h-10 p-2 cursor-pointer">
                <File />
            </label>
            <input
                hidden
                type="file"
                id="input-file"
                {...register('file')}
            />

            <input
                type="text"
                {...register("content")}
                className="bg-slate-700 border-none flex-grow outline-none text-white p-2 rounded-lg"
                placeholder="Type your message..."
            />

            <Button type="submit" className="text-white text-center rounded-full w-10 h-10 p-2" size="icon" disabled={isSubmitting}>
                <Send />
            </Button>
            {errors.content && <span className="text-red-500">{errors.content.message}</span>}
        </form>
    );
};

export default FormMessage;
