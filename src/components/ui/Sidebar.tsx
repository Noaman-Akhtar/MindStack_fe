import { Logo } from "./icons/MindStacklogo";
import { TwitterIcon } from "./icons/twitter";
import { YoutubeIcon } from "./icons/youtube";
import { SidebarItem } from "./SidebarItem";
import { assets } from "../../assets/assets.js";

export function Sidebar({
    extended,
    setExtended,
}: {
    extended: boolean;
    setExtended: (v: boolean) => void;
}) {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`h-screen bg-[#2D2B55] text-[#C4C2FF] border-r border-amber-50/10 w-72 fixed left-0 top-0 z-40 transition-transform duration-300 ${extended ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header with menu + logo */}
                <div className="flex items-center px-4 py-1 gap-3 ">
                    {/* Menu button inside sidebar */}
                    <img
                        onClick={() => setExtended(!extended)}
                        className="cursor-pointer w-8 h-8 bg-[#3E3B6D] hover:bg-[#4D4A80] rounded-full shadow-md p-1 fixed transition-colors duration-300 left-56"
                        src={assets.menu_icon}
                        alt="menu"
                    />
                    <div className="flex items-center  gap-3">
                        <div className="mt-1">
                            <Logo />
                        </div>
                        <span className="text-2xl font-bold">MindStack</span>
                    </div>
                </div>

                {/* Sidebar items */}
                <div className="mt-6 space-y-2">
                    <SidebarItem text="Tweets" icon={<TwitterIcon />} />
                    <SidebarItem text="YouTube" icon={<YoutubeIcon />} />
                </div>
            </div>

            {/* Floating menu button when closed */}
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
