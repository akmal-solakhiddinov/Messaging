import { useState } from "react";
import UserItem from "./userItem";
import { Link } from "react-router-dom";
import useSearchUsers from "@/hooks/useSearchUsers";
import { UserType } from "@/lib/type";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface Props {
    closeBtn?: () => void;
}

const SearchBar: React.FC<Props> = ({ closeBtn }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isSearching, result: results } = useSearchUsers(searchQuery)


    return (
        <div
            className={`sticky top-0 bg-slate-700 z-20 transition-all duration-300 ${isExpanded ? 'absolute inset-0 w-full' : 'p-2'
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
                                <ul className="space-y-2">
                                    {results.map((result: UserType) => (
                                        <Link key={result.id} to={`profile/${result.id}`}>
                                            <UserItem user={result} />
                                        </Link>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-400">No results found.</p>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <div className="w-full flex justify-between items-center">
                    <span
                        className="rounded-full bg-slate-200 p-2 text-slate-800 cursor-pointer w-11/12"
                        onClick={() => setIsExpanded(true)}
                    >
                        Search
                    </span>
                    {closeBtn && <Button onClick={closeBtn} className="md:hidden " variant={'ghost'}><X /></Button>}
                </div>
            )}
        </div>
    );
};


export default SearchBar;