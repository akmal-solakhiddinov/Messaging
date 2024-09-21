import Spinner from "@/components/shared/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import useCreateRequest from "@/hooks/useCreateRequest";
import useCreateRoom from "@/hooks/useCreateRoom";
import useFetchOneUser from "@/hooks/useFetchOneUser";
import useSEO from "@/hooks/useSEO";
import { formatTime } from "@/lib/helper";
import { User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
    const { id } = useParams<string>();
    const { profile, isFetchingUser } = useFetchOneUser(id);
    const { createFriendRequest } = useCreateRequest();
    const { createRoom } = useCreateRoom();
    useSEO(profile?.fullName)


    return isFetchingUser ? (
        <Spinner />
    ) : (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 shadow-md">
                    {profile?.image ? (
                        <img src={profile.image} alt={profile.fullName} className="object-cover w-32 h-32" />
                    ) : (
                        <User className="w-32 h-32 text-gray-500" />
                    )}
                </div>

                <div className="space-y-2 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{profile?.fullName}</h2>
                    <p className="text-sm text-gray-600">Username: {profile?.username}</p>
                    <p className="text-sm text-gray-600">Email: {profile?.email}</p>
                    <p className="text-sm text-gray-600">Account: {profile?.account}</p>
                    <p className="text-sm text-gray-600">
                        Status: {profile?.status === 'online' ? 'Online' : formatTime(profile?.lastLogin)}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-4 text-center">
                    {profile?.account === 'private' ? (
                        <Button onClick={() => createFriendRequest(profile?.id)} className="w-full">
                            Send Friend Request
                        </Button>
                    ) : profile?.chatRoomId ? (
                        <Link to={`/room/${profile?.chatRoomId}`} className={`w-full ${buttonVariants()}`}>
                            Continue Messaging
                        </Link>
                    ) : (
                        <Button onClick={() => createRoom(profile?.id)} className="w-full">
                            Start Messaging
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
