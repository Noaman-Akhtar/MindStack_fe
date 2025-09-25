import { useState, type Component, type ComponentType, type ReactElement, type ReactNode } from "react";

export function SidebarItem({text,icon}:{
    text:string;
    icon:ReactElement;
}){
    
    return <div className="flex items-center pl-5 gap-3 text-l cursor-pointer hover:bg-gray-700 px-4 py-4 rounded-md  w-full">
        <div className="w-6 h-6 flex items-center justify-center ">
            {icon}
        </div>
        <div className="text-xl font-medium">{text}</div>
    </div>
}