import { ShareIcon } from "../icons/shareIcon";
import { Trash } from "lucide-react";
import { TwitterIcon } from "../icons/twitter";
import { YoutubeIcon } from "../icons/youtube";
import { Notes } from "../icons/notes"
import { useEffect, useRef, useState } from "react";
import { getYouTubeId, getYouTubeEmbedUrl, normalizeTwitterUrl } from "../../utils/embed";

import { normalizeModuleId } from "vite/module-runner";

interface CardProps {
    _id?: string;
    text: string;
    type: "twitter" | "youtube";
    link: string;
    note?: string;
    onDelete?: (id: string) => void;
}

// Remove the getYouTubeId function since it's now imported from utils

export function Card({ _id, text, type, link, onDelete, note }: CardProps) {

    useEffect(() => {
        if (type === "twitter" && document.getElementById('twitter-wjs')) {
            try {
                // @ts-ignore
                window.twttr?.widgets?.load();
            } catch (e) {
                console.warn('Twitter widget load failed', e);
            }
            return;
        }
    }, [])

    const ytId = type === "youtube" ? getYouTubeId(link) : null;
    const ytEmbed = ytId ? getYouTubeEmbedUrl(ytId) : null;
    const noteRef = useRef<HTMLDivElement>(null);


    return ( //#303060
        <div className="p-4 bg-[#303060] rounded-md transition-transform duration-300 ease-in-out transform hover:scale-106 shadow-md text-white border-gray-600 w-76 mt-8 border h-70 overflow-y-auto scrollbar-hidden">
            <div className="flex justify-between">
                <div className="flex items-center justify-center gap-1.5">
                    {type === "twitter" && <TwitterIcon />}{type === "youtube" && <YoutubeIcon />}
                    <p>{text}</p>
                </div>

                <div className=" ml-2 flex items-center gap-3">
                    {note && <div className=" cursor-pointer" onClick={() => {
                        noteRef.current?.scrollIntoView({ behavior: 'smooth', block: "center" })
                    }}>
                        <Notes />
                    </div>}

                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <ShareIcon size="md"  />
                    </a>
                    <button
                        aria-label="Delete" title="Delete"
                        className="text-red-500 hover:text-red-600 "
                        onClick={(e) => {
                            e.stopPropagation();
                            if (_id) onDelete?.(_id);
                        }}
                    >
                        <Trash className="hover:cursor-pointer " size={14} />
                    </button>
                </div>
            </div>

            <div className="pt-4 ">
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
  <div className="tweet-embed">
    <div
      className="tweet-scale"
      style={{ transform: 'scale(0.8)', width: '125%'  }} // adjust scale & width
    >
      <blockquote className="twitter-tweet">
        <a href={normalizeTwitterUrl(link)}></a>
      </blockquote>
    </div>
  </div>
)}


            </div>
            {note && <div ref={noteRef} className={type=="twitter"? "pt-1":"pt-6"}>
                {note}
            </div>}

        </div >
    );
}