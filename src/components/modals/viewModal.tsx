import { useEffect, useMemo, useState, useCallback } from "react";
import DOMPurify from "dompurify";
import { CrossIcon } from "../icons/CrossIcon";
import {
    getYouTubeId,
    getYouTubeEmbedUrl,
    normalizeTwitterUrl,
} from "../../utils/embed";
import { RichTextEditor } from "../ui/RichTextEditor/RichtextEditor";
import Quill from "quill";
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface ViewContentModalProps {
    content: any;
    onClose?: () => void;
    onUpdated?: (updated: any) => void;
}

export function ViewContentModal({
    content,
    onClose,
    onUpdated,
}: ViewContentModalProps) {
    const { _id, title, richNoteDelta } = content; // removed unused: type, link, note
    const [editMode, setEditMode] = useState(false);
    const [delta, setDelta] = useState<any>(richNoteDelta || null);
    // html state is only for edit mode live preview; for view mode we derive from delta
    const [html, setHtml] = useState("");

    // When a different content object is provided, sync local state (especially if modal reused)
    useEffect(() => {
        setDelta(richNoteDelta || null);
        // Reset html (will be regenerated in edit mode or derived for view)
        setHtml("");
    }, [_id, richNoteDelta]);
    const [saving, setSaving] = useState(false);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);

   
    // Helper to convert delta -> HTML (for view mode) without storing richNote on backend
    const deltaToHtml = useCallback((d: any): string => {
        if (!d) return "";
        try {
            const tempContainer = document.createElement("div");
            const q = new Quill(tempContainer);
            q.setContents(d);
            return q.root.innerHTML;
        } catch {
            return "";
        }
    }, []);

    const safeHtml = useMemo(() => {
        const base = editMode ? html : deltaToHtml(delta);
        return base ? DOMPurify.sanitize(base, { USE_PROFILES: { html: true } }) : "";
    }, [html, delta, editMode, deltaToHtml]);

   
    useEffect(() => {
        const container = document.getElementById("rich-note-view");
        if (!container) return;
        const handler = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
                const src = (target as HTMLImageElement).src;
                if (src) setLightboxImg(src);
            }
        };
        container.addEventListener("click", handler);
        return () => container.removeEventListener("click", handler);
    }, [safeHtml, editMode]);

    async function save() {
        setSaving(true);
        try {
            const { data } = await axios.put(
                `${BACKEND_URL}/api/v1/content/${_id}`,
                { richNoteDelta: delta },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            onUpdated?.(data.content);
            setEditMode(false);
        } catch (e) {
            console.error(e);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="relative bg-white rounded-md p-6 w-[min(800px,80vw)] max-h-[calc(100vh-3rem)] overflow-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className="absolute top-2 right-2 cursor-pointer"
                onClick={onClose}
                aria-label="Close"
            >
                <CrossIcon />
            </button>

            <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="flex gap-2">
                    {!editMode && (
                        <button
                            className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </button>
                    )}
                    {editMode && (
                        <>
                            <button
                                className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-200"
                                onClick={() => {
                                    setDelta(richNoteDelta || null);
                                    setHtml("");
                                    setEditMode(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={saving}
                                className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                                onClick={save}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Rich Note View or Edit */}
            {!editMode && (
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Rich Notes</h3>
                    {safeHtml ? (
                        <div
                            id="rich-note-view"
                            className="rich-note-view max-w-none space-y-4"
                            dangerouslySetInnerHTML={{ __html: safeHtml }}
                        />
                    ) : (
                        <div className="text-sm text-gray-500 italic" id="rich-note-view">
                            (No rich notes saved yet)
                        </div>
                    )}
                </div>
            )}

            {editMode && (
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Edit Rich Notes</h3>
                    <RichTextEditor
                        initialDelta={delta}
                        initialHtml={html}
                        contentKey={_id}
                        onHtmlChange={setHtml}
                        onDeltaChange={setDelta}
                    />
                </div>
            )}

            {/* Lightbox */}
            {lightboxImg && (
                <div
                    className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center"
                    onClick={() => setLightboxImg(null)}
                >
                    <img
                        src={lightboxImg}
                        alt="enlarged"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-xl"
                    />
                </div>
            )}
        </div>
    );
}
