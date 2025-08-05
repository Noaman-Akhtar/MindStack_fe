import { Logo } from "./icons/MindStacklogo";
import { TwitterIcon } from "./icons/twitter";
import { YoutubeIcon } from "./icons/youtube";
import { SidebarItem } from "./SidebarItem";

export function Sidebar(){
    return <div className="h-screen bg-[#2D2B55] text-[#C4C2FF] border-r-1 border-amber-50/10 w-72 absolute fixed left-0 top-0">
        <div className=" ">
            <div className="flex items-center text-3xl font-bold gap-3">
                <div className="mt-2"><Logo/></div>
                MindStack
            </div>
            <div className="">
            <SidebarItem text="tweets" icon={<TwitterIcon/>}/>
            </div>
            <div className="">
            <SidebarItem text="youtube" icon={<YoutubeIcon/>}/>
            </div>
        </div>
    </div>
}