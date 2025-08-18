import { PlusIcon } from "./icons/plusIcon";
import { ShareIcon } from "./icons/shareIcon";
import { Trash } from "lucide-react";
import { TwitterIcon } from "./icons/twitter";
import { YoutubeIcon } from "./icons/youtube";

interface CardProps {
   
    _id?: string;
    text: string;
    type: "twitter" | "youtube";
    link: string;
    onDelete?: (id: string) => void;
}

// Parse a YouTube URL to extract the video ID from watch, shorts, youtu.be, or embed forms
function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();

        // youtu.be/<id>
        if (host.includes("youtu.be")) {
            const id = u.pathname.slice(1);
            return id || null;
        }

        // youtube.com/* variants
        if (host.includes("youtube.com")) {
            // /watch?v=<id>
            if (u.pathname.startsWith("/watch")) {
                return u.searchParams.get("v");
            }
            // /shorts/<id>
            if (u.pathname.startsWith("/shorts/")) {
                return u.pathname.split("/")[2] || null;
            }
            // /embed/<id>
            if (u.pathname.startsWith("/embed/")) {
                return u.pathname.split("/")[2] || null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

export function Card({ _id, text, type, link, onDelete }: CardProps) {
    const ytId = type === "youtube" ? getYouTubeId(link) : null;
    const ytEmbed = ytId ? `https://www.youtube.com/embed/${ytId}` : null; // or https://www.youtube-nocookie.com/embed/${ytId}

    return (
        <div className="p-4 bg-white rounded-md shadow-md border-gray-200 min-w-68 border h-70 overflow-y-auto">
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                   {type==="twitter"&& <TwitterIcon/>}{type==="youtube" && <YoutubeIcon/>} 
                    {text}
                </div>
                <div className=" ml-2 flex items-center gap-2">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <ShareIcon size="md" />
                    </a>
                    <button
                        aria-label="Delete" title="Delete"
                        className="text-red-500 hover:text-red-600 "
                        onClick={(e) => {
                            e.stopPropagation();
                            if(_id) onDelete?.(_id);
                        }}
                    >
                        <Trash className="hover:cursor-pointer" size={19} />
                    </button>
                </div>
            </div>

            <div className="pt-4">
                {type === "youtube" && (
                    ytEmbed ? (
                        <iframe
                            className="w-full h-48"
                            src={ytEmbed}
                            title="YouTube video"
                            frameBorder={0}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    ) : (
                        <a
                            className="text-blue-500 underline"
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open on YouTube
                        </a>
                    )
                )}

                {type === "twitter" && (
                    <blockquote className="twitter-tweet">
                        <a href={link.replace("x.com", "twitter.com")}></a>
                    </blockquote>
                )}
            </div>
        </div >
    );
}