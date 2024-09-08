import { useSystem } from "@/context/systemContext"
import { useParams } from "react-router-dom"
import { Sheet, SheetContent } from "../ui/sheet"
import SearchBar from "./searchBar"
import UserList from "./userList"
import TabBar from "../tabBar"

const Sidebar = () => {
    const params = useParams()
    const { sheet, setSheet } = useSystem()

    const handleOpenChange = (isOpen: boolean) => {
        setSheet(isOpen); // Syncs the context state with the Sheet's open state
    };
    return (
        <>
            {!params?.id ? (
                <aside className="md:hidden bg-slate-700 border-r  border-slate-600 h-screen  relative pb-28">
                    <SearchBar />
                    <UserList />
                    <TabBar />
                </aside>
            ) : null}

            <aside className=" hidden md:block bg-slate-700 border-r  border-slate-600 h-screen  relative pb-28">
                <SearchBar />
                <UserList />
                <TabBar />
            </aside>

            <Sheet open={sheet} onOpenChange={handleOpenChange}>
                <SheetContent side="left" className="p-0 md:hidden">
                    <SearchBar closeBtn={() => setSheet(false)} />
                    <UserList />
                    <TabBar />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default Sidebar;