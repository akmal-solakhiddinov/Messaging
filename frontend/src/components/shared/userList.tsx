import UserItem from "./userItem";
import useRoomFetch from "@/hooks/useRoomFetch";
import { ScrollArea } from "../ui/scroll-area";
import { NavLink } from "react-router-dom";
import { useSystem } from "@/context/systemContext";
import Spinner from "./Spinner";

const UserList = () => {
    const { rooms, isLoading } = useRoomFetch()
    const { setSheet } = useSystem()
    return (

        <ScrollArea className="space-y-2 h-full bg-slate-700 px-4 scroll-p-10 last:mb-16">
            {isLoading && <Spinner />}
            {rooms?.map((room) => (
                <NavLink
                    to={`room/${room?.id}`} key={room.id}
                    onClick={() => setSheet(false)}
                    className={({ isActive }) =>
                        `flex last:mb-14 items-center p-2 rounded-lg cursor-pointer ${isActive ? 'bg-slate-600 text-white' : 'hover:bg-slate-600'}`
                    }>
                    <UserItem user={room.user} />
                </NavLink >
            ))}
        </ScrollArea>

    );
};

export default UserList
