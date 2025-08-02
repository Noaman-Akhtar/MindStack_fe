import { PlusIcon } from "./icons/plusIcon"
import { ShareIcon } from "./icons/shareIcon"

interface CardProps{
    text: string;
    type: "twitter" | "youtube";
    link: string;
}

export function Card({text, type, link}: CardProps){
    return(
        <div className="p-4 bg-white rounded-md shadow-md border-gray-200 max-w-72 border">
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                    <PlusIcon size="md"/>
                    {text}
                </div>
                <div className="flex gap-2">
                    <a href={link} target="_blank" rel="noopener noreferrer"> 
                        <ShareIcon size="md"/>
                    </a>
                    <PlusIcon size="md"/>
                </div>
            </div>
            
            <div className="pt-4">
                {type === "youtube" && (
                    <iframe 
                        className="w-full h-48" 
                        src={link.replace("watch","embed").replace("?v=","/")} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    />
                )}
                
                {type === "twitter" && (
                    <blockquote className="twitter-tweet">
                        <a href={link.replace("x.com", "twitter.com")}></a>
                    </blockquote>
                )}
            </div>
        </div>
    )
}