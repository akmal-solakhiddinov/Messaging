/* 
[
    {
        "id": "cdc807d4-6f37-44a6-b333-12e68014e97f",
        "user": {
            "username": null,
            "email": "akmal@gmail.com",
            "id": "5d463f14-c18f-4ee1-86ea-81534ee5ec85",
            "image": null,
            "fullName": null,
            "status": "offline"
        }
    }
]

*/

import { UserType } from "@/lib/type"
import React from "react"



interface Props {
    user: UserType
}

const UserItem: React.FC<Props> = ({ user }) => {
    return (
        <>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold mr-4 overflow-hidden">
                {user?.image ? (
                    <img src={user.image} alt={user.fullName} className="object-cover w-full h-full" />
                ) : (
                    user?.fullName && user.fullName[0]
                )}
            </div>

            <div className="flex-1">
                <div className="text-white font-medium">{user.fullName}</div>
                <div className="text-slate-400 text-sm">{user.status}</div>
            </div>
            <div
                className={`w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green-500' : user.status === 'offline' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                title={user.status}
                aria-label={`Status: ${user.status}`}
            />
        </>
    )
}

export default UserItem