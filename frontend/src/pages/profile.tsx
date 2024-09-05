import { Button, buttonVariants } from "@/components/ui/button";
import { useSystem } from "@/context/systemContext";
import useCreateRequest from "@/hooks/useCreateRequest";
import useCreateRoom from "@/hooks/useCreateRoom";
import useFetchOneUser from "@/hooks/useFetchOneUser";
import { User } from "lucide-react";
import { Link, useParams } from "react-router-dom"

const Profile = () => {
    const { id } = useParams<string>();
    const { profile, isFetchingUser } = useFetchOneUser(id);
    const { createFriendRequest, isCreatingRequest } = useCreateRequest()
    const { createRoom, isCreatingRoom } = useCreateRoom()


    return isFetchingUser ? (<div>Loading...</div>)
        : (
            <div className="p-6  h-full" >
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-600">
                    {profile?.image ? (
                        <img src={profile?.image} alt={profile?.fullName} className="object-cover w-32 h-32" />
                    ) : (
                        <User className="w-32 h-32" />
                    )}
                </div>

                <div className="flex flex-col gap-3 items-start justify-center">

                    <h2 className="text-lg text-slate-100">
                        Email: {profile.email}
                    </h2>
                    <h2 className="text-lg text-slate-100">
                        Username: {profile.username}
                    </h2>
                    <h2 className="text-lg text-slate-100">
                        Full Name: {profile.fullName}
                    </h2>
                    <h2 className="text-lg text-slate-100">
                        Account: {profile.account}
                    </h2>
                    <h2 className="text-lg text-slate-100">
                        Status: {profile.status}
                    </h2>
                </div>

                <div>{
                    profile.account === 'private' ?
                        (
                            <Button onClick={() => createFriendRequest(profile.id)}>Send Request</Button>
                        ) :
                        profile.chatRoomId ?
                            (<Link to={`/room/${profile.chatRoomId}`} className={buttonVariants()}>Continue messaging</Link>) :
                            (<Button onClick={() => createRoom(profile.id)}>Start Messagin</Button>)

                }
                </div>
            </div >
        )
}

export default Profile;








