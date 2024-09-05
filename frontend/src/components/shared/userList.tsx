import UserItem from "./userItem";
import useRoomFetch from "@/hooks/useRoomFetch";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";

const UserList = () => {
    const { rooms, loading } = useRoomFetch()
    return (
        <ScrollArea className="space-y-2 bg-slate-700 px-4 h-full ">
            {loading && <div>Loading...</div>}    {rooms?.map(room => (
                <Link to={`room/${room?.id}`} key={room.id}>
                    <UserItem user={room.user} />
                </Link>
            ))}
        </ScrollArea>
    );
};

export default UserList