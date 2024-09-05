import { MessageType } from "@/lib/type";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { File } from "lucide-react";
import useEditMessage from "@/hooks/useEditMessage";

interface ModalFormEditMessageProps {
    message: MessageType;
}

const schema = z.object({
    content: z.string().optional(),
    file: z.union([z.string(), z.instanceof(FileList)]).optional(),
}).refine(data => data.content || (data.file instanceof FileList && data.file.length > 0), {
    message: "Either message content or a file is required",
    path: ["content"],
});

type Schema = z.infer<typeof schema>;

const ModalFormEditMessage: React.FC<ModalFormEditMessageProps> = ({ message }) => {
    const { handleSubmit, register, formState: { isSubmitting, errors } } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: message?.content,
        }
    });

    const { editMessage, isEditing } = useEditMessage();

    const onSubmit = async (data: Schema) => {
        try {
            if (typeof data.file === 'string' && data.file === "") {
                data.file = undefined; // Handle cases where no file is selected
            }

            editMessage({ data, messageId: message.id });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-max">
                <DialogTitle>Edit your message</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <label htmlFor="input-file" className="flex flex-row border w-full text-center rounded-md p-2 cursor-pointer">
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

                    {errors.content && <span className="text-red-500">{errors.content.message}</span>}

                    <Button type="submit" className="text-white text-center p-2" disabled={isSubmitting || isEditing}>
                        {isSubmitting || isEditing ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalFormEditMessage;
