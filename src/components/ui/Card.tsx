import { PlusIcon } from "./icons/plusIcon";
import { ShareIcon } from "./icons/shareIcon";

interface CardProps {
  text: string;
  type: "twitter" | "youtube";
  link: string;
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

export function Card({ text, type, link }: CardProps) {
  const ytId = type === "youtube" ? getYouTubeId(link) : null;
  const ytEmbed = ytId ? `https://www.youtube.com/embed/${ytId}` : null; // or https://www.youtube-nocookie.com/embed/${ytId}

  return (
    <div className="p-4 bg-white rounded-md shadow-md border-gray-200 max-w-72 border">
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5">
          <PlusIcon size="md" />
          {text}
        </div>
        <div className="flex gap-2">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ShareIcon size="md" />
          </a>
          <PlusIcon size="md" />
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
    </div>
  );
}