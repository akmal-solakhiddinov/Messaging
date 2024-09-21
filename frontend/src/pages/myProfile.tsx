import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import useGetAllRequests from "@/hooks/useGetAllRequests";
import { useLogout } from "@/hooks/useLogout";
import useSEO from "@/hooks/useSEO";
import useUpdateRequestStatus from "@/hooks/useUpdateRequestStatus";
import { formatTime } from "@/lib/helper";
import { RequestType } from "@/lib/type";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const MyProfile = () => {
    const { user } = useAuth();
    const { logout } = useLogout();
    const { friendRequests, isFetchingRequests } = useGetAllRequests();
    const { updateRequestStatus } = useUpdateRequestStatus();
    useSEO(user?.fullName)


    const handleLogout = () => logout();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-6 items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 shadow-md">
                    {user?.image ? (
                        <img src={user.image} alt={user.fullName} className="object-cover w-32 h-32" />
                    ) : (
                        <User className="w-32 h-32 text-gray-500" />
                    )}
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-500">{user?.fullName}</h3>
                    <p className="text-sm text-gray-600">{user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-600">{user?.account}</p>
                    <p className="text-sm text-gray-600">
                        {user?.status === 'online' ? 'Online' : formatTime(user?.lastLogin)}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link to={'update'} className={`max-w-max ${buttonVariants()}`}>
                        Edit Profile
                    </Link>
                    <Button onClick={handleLogout} variant="destructive" className="max-w-max">
                        Logout
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Friend Requests</h4>
                <ul className="space-y-4">
                    {!isFetchingRequests && friendRequests.map((request: RequestType) => (
                        <li key={request.id} className="flex items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold mr-4">
                                {request.sender?.fullName ? request.sender.fullName[0] : 'A'}
                            </div>
                            <div className="flex-1">
                                <div className="text-gray-900 font-medium">{request.sender?.fullName}</div>
                                <div className="text-gray-500 text-sm">{request.sender?.status}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => updateRequestStatus({ requestId: request.id, status: 'approved' })}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => updateRequestStatus({ requestId: request.id, status: 'rejected' })}
                                >
                                    Reject
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default MyProfile;
