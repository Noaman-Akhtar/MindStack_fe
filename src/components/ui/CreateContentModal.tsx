import { useRef, useState } from "react";
import { Button } from "./Button";
import { CrossIcon } from "./icons/CrossIcon";
import { Input } from "./Input";
import { useEffect } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";
// Use enum now that erasableSyntaxOnly is disabled
enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
    RandomLinks = "random",
}
interface CreateContentModalProps{
    open:boolean;
    onClose?:() => void;
}

export function CreateContentModal({open,onClose}:CreateContentModalProps){
    const titleref= useRef<HTMLInputElement>(null);
    const linkref= useRef<HTMLInputElement>(null);
    const [type,setType] = useState<ContentType | null>(null);
        const [menuOpen, setMenuOpen] = useState(false);
        const [typeError, setTypeError] = useState<string | null>(null);
        const typeOptions: { label: string; value: ContentType }[] = [
            { label: "YouTube", value: ContentType.Youtube },
            { label: "Twitter", value: ContentType.Twitter },
            { label: "Random links", value: ContentType.RandomLinks },
        ];
        const currentLabel = typeOptions.find(o => o.value === type)?.label ?? "Select type";
   async function addcontent(){
        const title = (titleref.current?.value ?? "").trim();
        const link = (linkref.current?.value ?? "").trim();

        // Validate required fields
        if (!type) {
            setTypeError("Please choose a type");
            return;
        }
        setTypeError(null);
        await axios.post(`${BACKEND_URL}/api/v1/content`,{
            link,
            title,
            type
        },{
            headers:{
                "Authorization":localStorage.getItem("token")
            }
        })
        onClose?.();
    }
    //for closing on escape
      useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
return( <div>
    {open && <div className="fixed inset-0 bg-slate-500/60 flex items-center justify-center" onClick={onClose}>
        <div className="flex flex-col justify-center">
            <span className="bg-white p-10 rounded-md"
              onClick={(e) => e.stopPropagation()} // keep clicks inside from bubbling to overlay"
              ><div className="flex justify-end" onClick={onClose} ><CrossIcon/></div>
<div className="w-3xs flex flex-col gap-y-2">
    <Input variant="primary" ref={titleref} placeholder={"Title"}/>
    <Input variant="primary" ref={linkref} placeholder={"Link"}/>
                        {/* Type selector */}
                        <div className="relative mt-3 flex justify-center ">
                            <div onClick={() => setMenuOpen(v => !v)}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    text={`Type: ${currentLabel}`}
                                />
                            </div>
                            {menuOpen && (
                                <div className="absolute left-0 right-0 mt-2 bg-white text-black rounded-md shadow-lg ring-1 ring-black/5 z-50">
                                    {typeOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${opt.value === type ? 'bg-gray-50 font-medium' :''}`}
                                            onClick={() => { setType(opt.value); setTypeError(null); setMenuOpen(false); }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {typeError && (
                                <p className="mt-2 text-sm text-red-600">{typeError}</p>
                            )}
                        </div>
</div>
<div className="flex justify-center mt-3">
    <Button variant="primary" size="md" text="submit" onClick={addcontent}></Button>
</div>
            </span>
        </div>
        </div>
    }
     
</div>)
}