import { useSystem } from "@/context/systemContext"
import { useLocation } from "react-router-dom"
import { Sheet, SheetContent } from "../ui/sheet"
import SearchBar from "./searchBar"
import UserList from "./userList"
import TabBar from "../tabBar"

const Sidebar = () => {
    const params = useLocation()
    const { sheet, setSheet } = useSystem()

    const handleOpenChange = (isOpen: boolean) => {
        setSheet(isOpen);
    };

    return (
        <div className="bg-slate-800 w-full md:w-80 md:h-screen rounded-2xl overflow-hidden shadow-lg">
            {/* Mobile Sidebar (shown only when pathname is `/`) */}
            {params?.pathname === '/' && (
                <aside className="md:hidden w-full bg-slate-700 border-r h-screen border-slate-600 overflow-hidden">
                    <div className="w-full bg-slate-500 py-3 flex flex-row items-center sticky top-0 z-50">
                        <TabBar />
                        <SearchBar />
                    </div>
                    <UserList />
                </aside>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:block bg-slate-700 border-r h-screen border-slate-600">
                <div className="sticky top-0 z-50 h-14 w-full bg-slate-500 py-3 flex flex-row items-center">
                    <TabBar />
                    <SearchBar />
                </div>
                <UserList />
            </aside>

            {/* Mobile Sheet Sidebar */}
            <Sheet open={sheet} onOpenChange={handleOpenChange}>
                <SheetContent side="left" className="p-0 md:hidden">
                    <SearchBar closeBtn={() => setSheet(false)} />
                    <UserList />
                </SheetContent>
            </Sheet>
        </div>

    )
}

export default Sidebar;