import { useEffect, useMemo, useState, useCallback } from "react";
import DOMPurify from "dompurify";
import { CrossIcon } from "../icons/CrossIcon";
import { RichTextEditor } from "../../utils/RichTextEditor/RichtextEditor";
import { MultiUploader } from "../../utils/FileUpload/uploaderUi";
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
  const { _id, title, richNoteDelta } = content;
  const [editMode, setEditMode] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [delta, setDelta] = useState<any>(richNoteDelta || null);

  const [html, setHtml] = useState("");

  // When a different content object is provided, sync local state (especially if modal reused)
  useEffect(() => {
    setDelta(richNoteDelta || null);
    // Reset html (will be regenerated in edit mode or derived for view)
    setHtml("");
  }, [_id, richNoteDelta]);

  const [saving, setSaving] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

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
    return base
      ? DOMPurify.sanitize(base, { USE_PROFILES: { html: true } })
      : "";
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

  async function handleUploadComplete(newDocs: any[]) {
    const existingDocs = content.documents || [];
    const updatedDocs = [...existingDocs, ...newDocs];

    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/content/${_id}`,
        { documents: updatedDocs },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      onUpdated?.(data.content);
      setShowUploader(false);
    } catch (e) {
      console.error("Failed to upload docs", e);
      alert("Failed to update documents.");
    }
  }

  async function deleteDocument(docId: string) {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const existingDocs = content.documents || [];
    const updatedDocs = existingDocs.filter((d: any) => d.cloudinaryId !== docId);

    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/content/${_id}`,
        { documents: updatedDocs },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      onUpdated?.(data.content);
    } catch (e) {
      console.error("Failed to delete doc", e);
      alert("Failed to delete document.");
    }
  }

  return (
    <div
      className="relative bg-white rounded-md p-6 w-[min(800px,80vw)] max-h-[calc(100vh-3rem)] overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-[0.5%]  right-[0.3%] cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <CrossIcon />
      </button>

      <div className="flex justify-between items-start gap-4 mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          {!editMode && !showUploader && (
            <>
              <button
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="px-3 mr-5 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-500"
                onClick={() => setShowUploader(true)}
              >
                Add Docs
              </button>
            </>
          )}
          {editMode && (
            <>
              <div className="flex gap-2 mr-5">
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
              </div>
            </>
          )}
        </div>
      </div>

      {showUploader && (
        <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Upload Documents</h3>
            <button
              onClick={() => setShowUploader(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <MultiUploader onComplete={handleUploadComplete} />
        </div>
      )}

      {/* Rich Note View or Edit */}
      {!editMode && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Notes</h3>
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
      {content.documents?.length > 0 && !editMode && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Documents</h3>
          <ul className="space-y-1 text-sm">
            {content.documents.map((doc: any) => {
              const ext = (doc.name || "").split(".").pop()?.toUpperCase();
              const isImg = /^image\//.test(doc.type);
              return (
                <li key={doc.cloudinaryId} className="flex items-center gap-3">
                  {isImg ? (
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-12 h-12 object-cover rounded cursor-zoom-in"
                      onClick={() => setLightboxImg(doc.url)}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-700 rounded text-xs font-medium">
                      {ext || "DOC"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{doc.name}</div>
                    <div className="text-xs text-gray-500">
                      {(doc.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs"
                  >
                    open
                  </a>
                  <button
                    onClick={() => deleteDocument(doc.cloudinaryId)}
                    className="text-red-600 hover:text-red-800 text-xs ml-2"
                  >
                    delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
