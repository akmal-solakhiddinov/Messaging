import UserItem from "./userItem";
import useRoomFetch from "@/hooks/useRoomFetch";
import { ScrollArea } from "../ui/scroll-area";
import { Link, NavLink } from "react-router-dom";
import { useSystem } from "@/context/systemContext";

const UserList = () => {
    const { rooms, loading } = useRoomFetch()
    const { setSheet } = useSystem()
    return (
        <ScrollArea className="space-y-2 bg-slate-700 px-4 h-full scroll-p-10 ">
            {loading && <div>Loading...</div>}
            {rooms?.map(room => (
                <NavLink
                    to={`room/${room?.id}`} key={room.id}
                    onClick={() => setSheet(false)}
                    className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg cursor-pointer ${isActive ? 'bg-slate-600 text-white' : 'hover:bg-slate-600'
                        }`
                    }>
                    <UserItem user={room.user} />
                </NavLink >
            ))}
        </ScrollArea>
    );
};

export default UserList