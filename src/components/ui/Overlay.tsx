import { useEffect, type ReactElement } from "react";


interface OverlayProps {
    open: boolean;
    onClose?: () => void;
    onContentAdded?: () => void;
    Modal?: ReactElement;
}

export function Overlay({ open, onClose, Modal }: OverlayProps) {

    //for closing on escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            {open && <div className="fixed inset-0 bg-slate-500/40 flex items-center z-40 justify-center  p-4" onClick={onClose}>
                {Modal}
            </div>
            }

        </>)
}