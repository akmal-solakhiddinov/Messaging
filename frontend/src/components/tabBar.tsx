// import { useAuth } from "@/context/authContext"
import { BellRingIcon, User2 } from "lucide-react"
import { Link } from "react-router-dom"

const TabBar = () => {
    // const { user } = useAuth()
    return (
        <div className="w-full bg-slate-500 py-3">
            <ul className="flex flex-row  gap-3 px-3">
                <Link to={`/profile`}><User2 /></Link>
                <li><BellRingIcon /></li>
            </ul>
        </div>
    )
}

export default TabBar