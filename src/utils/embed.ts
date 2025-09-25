// Parse a YouTube URL to extract the video ID from watch, shorts, youtu.be, or embed forms
export function getYouTubeId(url: string): string | null {
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

// Generate YouTube embed URL from video ID
export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

// Generate YouTube embed URL directly from any YouTube URL
export function getYouTubeEmbedFromUrl(url: string): string | null {
    const videoId = getYouTubeId(url);
    return videoId ? getYouTubeEmbedUrl(videoId) : null;
}

// Validate if a URL is a valid YouTube URL
export function isValidYouTubeUrl(url: string): boolean {
    return getYouTubeId(url) !== null;
}

// Additional utility: Get YouTube thumbnail URL
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

// ============ TWITTER/X UTILITIES ============

// Parse a Twitter/X URL to extract the tweet ID
export function getTwitterId(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();

        // x.com or twitter.com
        if (host.includes("x.com") || host.includes("twitter.com")) {
            // Pattern: /username/status/tweetId
            const pathParts = u.pathname.split('/');
            const statusIndex = pathParts.indexOf('status');
            
            if (statusIndex !== -1 && statusIndex + 1 < pathParts.length) {
                return pathParts[statusIndex + 1] || null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

// Convert X.com URL to Twitter.com URL for embed compatibility
export function normalizeTwitterUrl(url: string): string {
    return url.replace("x.com", "twitter.com");
}

// Validate if a URL is a valid Twitter/X URL
export function isValidTwitterUrl(url: string): boolean {
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        return (host.includes("x.com") || host.includes("twitter.com")) && 
               u.pathname.includes("/status/");
    } catch {
        return false;
    }
}

// Get Twitter username from URL
export function getTwitterUsername(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();

        if (host.includes("x.com") || host.includes("twitter.com")) {
            const pathParts = u.pathname.split('/').filter(part => part);
            return pathParts[0] || null;
        }

        return null;
    } catch {
        return null;
    }
}

// Generate Twitter embed URL (for oEmbed API)
export function getTwitterEmbedUrl(tweetUrl: string): string {
    const normalizedUrl = normalizeTwitterUrl(tweetUrl);
    return `https://publish.twitter.com/oembed?url=${encodeURIComponent(normalizedUrl)}`;
}

// ============ GENERAL UTILITIES ============

// Determine content type from URL
export function getContentType(url: string): 'youtube' | 'twitter' | 'unknown' {
    if (isValidYouTubeUrl(url)) return 'youtube';
    if (isValidTwitterUrl(url)) return 'twitter';
    return 'unknown';
}

// Validate URL based on type
export function isValidUrlForType(url: string, type: 'youtube' | 'twitter'): boolean {
    if (type === 'youtube') return isValidYouTubeUrl(url);
    if (type === 'twitter') return isValidTwitterUrl(url);
    return false;
}