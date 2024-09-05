import { UserType } from "@/lib/type";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { LucideCircleDot } from "lucide-react";
import { Button } from "./ui/button";
import useDelete from "@/hooks/useDelete";
import { useEffect } from "react";

interface RoomNavbarProps {
    friend: UserType | null;
    roomId: string | undefined
}


const RoomNavbar: React.FC<RoomNavbarProps> = ({ friend, roomId }) => {
    const navigate = useNavigate()
    const handleDeleteRoom = async () => {
        deleteItem(`rooms/delete/${roomId}`)
        navigate('/')
        window.location.reload()
    }


    useEffect(() => {
        document.title = friend?.fullName || 'unkown user';
    }, [friend?.fullName]);

    const { deleteItem, isDeleting } = useDelete()
    return (
        <div className="w-full bg-slate-700 py-5 px-6 h-14 flex items-center justify-between">
            <div className="flex items-center p-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold mr-4 overflow-hidden">
                    {friend?.image ? (
                        <img src={friend.image} alt={friend.fullName} className="object-cover w-full h-full" />
                    ) : (
                        friend?.fullName ? friend.fullName[0] : 'A'
                    )}
                </div>


                <div className="flex-1">
                    <Link to={`/profile/${friend?.id}`} className="text-white font-medium">{friend?.fullName}</Link>
                    <div className="text-slate-400 text-sm">{friend?.status}</div>
                </div>
                {/* <div
                className={`w-3 h-3 rounded-full ${friend.status === 'Online' ? 'bg-green-500' : friend.status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                title={friend.status}
                aria-label={`Status: ${friend.status}`}
            /> */}
            </div>

            <Popover>
                <PopoverTrigger><LucideCircleDot /></PopoverTrigger>
                <PopoverContent className="max-w-max">
                    <Button onClick={handleDeleteRoom} disabled={isDeleting}>Delete</Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default RoomNavbar;