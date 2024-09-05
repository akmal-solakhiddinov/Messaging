import { Button, buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext"
import useGetAllRequests from "@/hooks/useGetAllRequests";
import useUpdateRequestStatus from "@/hooks/useUpdateRequestStatus";
import { User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";

const MyProfile = () => {
    const { user } = useAuth();
    const { friendRequests, isFetchingRequests } = useGetAllRequests()
    const { updateRequestStatus, isUpdatingStatus } = useUpdateRequestStatus()
    const navigate = useNavigate();
    const { toast } = useToast()

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/registration')
    }


    return (
        <div className="p-6 h-full w-full">
            <div className="flex flex-col gap-3">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-600">
                    {user?.image ? (
                        <img src={user?.image} alt={user?.fullName} className="object-cover w-32 h-32" />
                    ) : (
                        <User className="w-32 h-32" />
                    )}
                </div>

                <div className="flex gap-3">
                    <Link to={'update'} className={`max-w-max ${buttonVariants()}`}>Edit Profile</Link>
                    <Button onClick={logout} className="max-w-max" variant={'destructive'}>Logout</Button>
                </div>
                <div>
                    <h3>{user?.fullName}</h3>
                    <h2>{user?.username}</h2>
                    <h2>{user?.email}</h2>
                    <h3>{user?.account}</h3>
                    <h3>{user?.lastLogin}</h3>
                    <h3>{user?.status}</h3>
                </div>

            </div>
            <div>
                <ul>
                    {!isFetchingRequests && friendRequests.map(request => (
                        <li key={request.id} className="flex items-center p-2 rounded-lg  bg-slate-600 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold mr-4">
                                {request.sender?.fullName ? request?.sender?.fullName[0] : 'A'}
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium">{request.sender.fullName}</div>
                                <div className="text-slate-400 text-sm">{request.sender.status}</div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant={'outline'} onClick={() => updateRequestStatus({ requestId: request.id, status: 'approved' })}>Approve</Button>
                                <Button variant={'destructive'}
                                    onClick={() => updateRequestStatus({ requestId: request.id, status: 'rejected' })}
                                > Reject</Button>
                            </div>

                        </li>

                    ))}
                </ul>
            </div>

            <Button onClick={() => {
                toast({
                    title: 'First Toast!'
                })
            }}>Toast</Button>
        </div>
    )
}

export default MyProfile