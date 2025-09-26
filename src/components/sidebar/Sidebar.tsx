import { Logo } from "../icons/MindStacklogo.js";
import { TwitterIcon } from "../icons/twitter.js";
import { YoutubeIcon } from "../icons/youtube.js";
import{AllLogo} from "../icons/All.js"
import { SidebarItem } from "./SidebarItem.js";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

type Filter = "all" | "twitter" | "youtube";

export function Sidebar({
    extended,
    setExtended,
    onSelectType,
    active,
}: {
    extended: boolean;
    setExtended: (v: boolean) => void;
    onSelectType: (f: Filter) => void;
    active: Filter;
}) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/signin");
    }

    return (
        <>
            <div
                className={`h-screen bg-[#2D2B55] text-[#C4C2FF] border-r border-amber-50/10 w-72 fixed left-0 top-0 z-40 transition-transform duration-300 ${extended ? "translate-x-0" : "-translate-x-full"
                    } flex flex-col`}
            >

                <div className="flex items-center px-4 py-1 gap-3 ">
                    <img
                        onClick={() => setExtended(!extended)}
                        className="cursor-pointer w-8 h-8 bg-[#3E3B6D] hover:bg-[#4D4A80] rounded-full shadow-md p-1 fixed transition-colors duration-300 left-60"
                        src={assets.menu_icon}
                        alt="menu"
                    />
                    <div className="flex items-center gap-3">
                        <div className="mt-1">
                            <Logo />
                        </div>
                        <span className="text-2xl font-bold">MindStack</span>
                    </div>
                </div>


                <div className="mt-6 space-y-2 flex-1">
                    <div
                        onClick={() => onSelectType("all")}
                        className={active === "all" ? "bg-white/10" : ""}
                    >
                        <SidebarItem text="All" icon={<AllLogo/>} />
                    </div>
                    <div
                        onClick={() => onSelectType("twitter")}
                        className={active === "twitter" ? "bg-white/10" : ""}
                    >
                        <SidebarItem text="Tweets" icon={<TwitterIcon />} />
                    </div>
                    <div
                        onClick={() => onSelectType("youtube")}
                        className={active === "youtube" ? "bg-white/10" : ""}
                    >
                        <SidebarItem text="YouTube" icon={<YoutubeIcon />} />
                    </div>
                </div>


                <div className="mt-auto mb-6" onClick={handleLogout}>
                    <SidebarItem text="Logout" icon={<LogOut className="w-6 h-6" />} />
                </div>
            </div>

        
            {!extended && (
                <img
                    onClick={() => setExtended(true)}
                    className="cursor-pointer w-8 h-8 bg-[#2D2B55] hover:bg-[#3E3B6D] rounded-full shadow-md p-1 fixed top-5 left-4 z-30 transition-all duration-300"
                    src={assets.menu_icon}
                    alt="menu"
                />
            )}
        </>
    );
}
