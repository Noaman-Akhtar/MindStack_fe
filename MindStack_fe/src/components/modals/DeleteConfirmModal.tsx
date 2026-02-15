import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  open,
  title,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[dcm-overlay-in_0.2s_ease-out]"
      onClick={onCancel}
    >

      <div className="absolute inset-0 bg-black/30" />

      <div
        className="relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A2E] shadow-2xl animate-[dcm-card-in_0.25s_cubic-bezier(.21,1.02,.73,1)]"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors cursor-pointer z-10"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center px-6 pt-7 pb-6">

          <h3 className="text-lg font-semibold text-white mb-2">
            Delete Content
          </h3>

          <p className="text-center text-sm text-gray-400 leading-relaxed max-w-[280px]">
            {title ? (
              <>
                Are you sure you want to delete{" "}
                <span className="text-[#C4C2FF] font-medium">"{title}"</span>?
              </>
            ) : (
              "Are you sure you want to delete this item?"
            )}
            <br />
            <span className="text-gray-500 text-xs mt-1 inline-block">
              This action cannot be undone.
            </span>
          </p>

          
          <div className="flex w-full gap-3 mt-7">
            <button
              ref={cancelBtnRef}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#C4C2FF] bg-[#2D2B55] hover:bg-[#3a3870] border border-[#C4C2FF]/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500/70  hover:from-red-500 hover:to-red-400 border border-red-400/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/15 cursor-pointer"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
