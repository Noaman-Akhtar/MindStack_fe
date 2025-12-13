import type { ReactElement } from "react";

export function SidebarItem({text,icon}:{
    text:string;
    icon?:ReactElement;
}){
    
    return <div className="flex items-center pl-3 gap-3 text-l cursor-pointer hover:bg-gray-700 px-3 py-3 ">
        <div className="w-[2vw] h-6 flex items-center justify-center ">
            {icon}
        </div>
        <div className="text-l font-medium">{text}</div>
    </div>
}