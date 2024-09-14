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
        <>
            {params?.pathname === '/' ? (
                <aside className="md:hidden bg-slate-700 border-r  border-slate-600 h-screen  relative ">
                    <div className=" w-full bg-slate-500 py-3  flex flex-row items-center sticky top-0 z-50">
                        <TabBar />
                        <SearchBar />
                    </div>
                    <UserList />
                </aside>
            ) : null}

            <aside className="  hidden md:block bg-slate-700 border-r  border-slate-600 h-screen  relative ">
                <div className="sticky top-0 z-50 h-14 w-full bg-slate-500 py-3  flex flex-row items-center">
                    <TabBar />
                    <SearchBar />
                </div>
                <UserList />
            </aside>

            <Sheet open={sheet} onOpenChange={handleOpenChange}>
                <SheetContent side="left" className="p-0 md:hidden">
                    <SearchBar closeBtn={() => setSheet(false)} />
                    <UserList />
                    {/* <TabBar /> */}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default Sidebar;