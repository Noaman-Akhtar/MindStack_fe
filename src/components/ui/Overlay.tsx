import { useEffect, type ReactElement } from "react";


interface OverlayProps {
    open: boolean;
    onClose?: () => void;
    onContentAdded?: () => void;
    Modal?: ReactElement;
}

export function Overlay({ open, onClose, onContentAdded, Modal }: OverlayProps) {

    //for closing on escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            {open && <div className="fixed inset-0 bg-slate-500/60 flex items-center z-2 justify-center" onClick={onClose}>
                {Modal}
            </div>
            }

        </>)
}