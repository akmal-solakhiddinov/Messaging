// import { File } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { determineFileType } from "@/lib/helper";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import useEditMessage from "@/hooks/useEditMessage";
import { MessageType } from "@/lib/type";


const messageSchema = z.object({
    content: z.string().optional(),
    file: z.union([z.string().optional(), z.instanceof(FileList).optional()]).optional(),
}).refine(data => data.content || (data.file && data.file.length > 0), {
    message: "Either a message content or a file is required",
    path: ["content"],
});

type ModalFormEditMessageProps = {
    message: MessageType;
};

type MessageSchema = z.infer<typeof messageSchema>;

const ModalFormEditMessage: React.FC<ModalFormEditMessageProps> = ({ message }) => {
    const { handleSubmit, reset, register, formState: { isSubmitting, errors, dirtyFields } } = useForm<MessageSchema>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: message?.content,
            file: ''
        }
    });
    const { editMessage, isEditing } = useEditMessage()
    console.log(dirtyFields)
    const onSubmit = async (data: MessageSchema) => {
        try {
            const formData = new FormData();

            if (data.content) {
                formData.append('content', data.content);
            }

            if (data.file && data.file instanceof FileList && data.file.length > 0) {
                const file = data.file[0];
                formData.append('file', file);
                formData.append('fileType', determineFileType(file.name));
            }

            editMessage({ data: formData, messageId: message.id })

            reset();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-max">
                <DialogTitle>Edit your message</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    {/* <label
                        htmlFor="input-file"
                        className="flex flex-row border w-full text-center rounded-md p-2 cursor-pointer"
                    >
                        <File />
                    </label> */}
                    <input
                        type="file"
                        id="input-file"
                        {...register('file')}
                    />

                    <input
                        type="text"
                        {...register('content')}
                        className="bg-slate-700 border-none flex-grow outline-none text-white p-2 rounded-lg"
                        placeholder="Type your message..."
                    />

                    {errors.content && (
                        <span className="text-red-500">{errors.content.message}</span>
                    )}

                    <Button
                        type="submit"
                        className="text-white text-center p-2"
                        disabled={isSubmitting || isEditing}
                    >
                        {isSubmitting || isEditing ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalFormEditMessage;

