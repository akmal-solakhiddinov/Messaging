import { useState } from "react";
import UserItem from "./userItem";
import { NavLink } from "react-router-dom";
import useSearchUsers from "@/hooks/useSearchUsers";
import { UserType } from "@/lib/type";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
    closeBtn?: () => void;
}

const SearchBar: React.FC<Props> = ({ closeBtn }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isSearching, result: results } = useSearchUsers(searchQuery)


    return (
        <div
            className={`transition-all duration-300 ${isExpanded ? 'absolute inset-0 w-full z-40' : ''
                }`}
        >
            {isExpanded ? (
                <div className="flex flex-col h-screen bg-slate-800 p-4">
                    <button
                        className="self-end text-white"
                        onClick={() => setIsExpanded(false)}
                    >
                        Close
                    </button>
                    <form className="flex flex-col flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="p-2 rounded mb-4 bg-slate-200 text-slate-800"
                        />
                        <div className="overflow-y-auto flex-1">
                            {isSearching ? (
                                <p className="text-slate-400">Searching...</p>
                            ) : results?.length > 0 ? (
                                <ScrollArea className="space-y-2 h-screen scroll-p-10 ">
                                    {results?.map((result: UserType) => (
                                        <NavLink
                                            to={`/profile/${result?.id}`} key={result.id}
                                            className={({ isActive }) =>
                                                `flex last:mb-20 items-center p-2 rounded-lg cursor-pointer ${isActive ? 'bg-slate-600 text-white' : 'hover:bg-slate-600'
                                                }`
                                            }>
                                            <UserItem user={result} />
                                        </NavLink >
                                    ))}
                                </ScrollArea>
                            ) : (
                                <p className="text-slate-400">No results found.</p>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <div className="w-full flex justify-between items-center">
                    <span
                        className=" cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                    >
                        <Search />
                    </span>
                    {closeBtn && <Button onClick={closeBtn} className="md:hidden " variant={'ghost'}><X /></Button>}
                </div>
            )}
        </div>
    );
};


export default SearchBar;