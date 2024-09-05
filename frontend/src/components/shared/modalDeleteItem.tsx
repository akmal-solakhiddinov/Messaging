import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import useDelete from "@/hooks/useDelete";

interface ModalDeleteItemProps {
    itemLink: string;
    text: string;
}

const ModalDeleteItem: React.FC<ModalDeleteItemProps> = ({ itemLink, text }) => {
    const { deleteItem } = useDelete()


    // const handleDelete = async () => {
    //     const res = await $axios.delete(itemLink)

    //     if (!res.data) throw new Error(res.data.message)
    // }
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant={'destructive'}>Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    {text}
                </DialogTitle>

                <div className="flex flex-row gap-3">
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant={'destructive'} onClick={() => deleteItem(itemLink)}>Delete</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ModalDeleteItem;