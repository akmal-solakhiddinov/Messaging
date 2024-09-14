import { useAuth } from "@/context/authContext"
import { BellRingIcon, User2 } from "lucide-react"
import { Link } from "react-router-dom"

const TabBar = () => {
    const { user } = useAuth()
    return (
        <>
            <ul className="flex flex-row w-full  gap-3 px-3 items-center justify-between">
                <Link to={`/profile`}>

                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold mr-4 overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={user.fullName} className="object-cover w-full h-full" />
                        ) : (
                            <User2 />
                        )}
                    </div>

                </Link>

                <li >
                    <BellRingIcon />
                </li>
            </ul>
        </>
    )
}

export default TabBar