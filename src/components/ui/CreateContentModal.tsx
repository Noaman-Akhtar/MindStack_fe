import { useRef, useState } from "react";
import { Button } from "./Button";
import { CrossIcon } from "./icons/CrossIcon";
import { Input } from "./Input";
// Use enum now that erasableSyntaxOnly is disabled
enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
}
interface CreateContentModalProps{
    open:boolean;
    onClose?:() => void;
}

export function CreateContentModal({open,onClose}:CreateContentModalProps){
    const titleref= useRef<HTMLInputElement>(null);
    const linkref= useRef<HTMLInputElement>(null);
    const [type,setType] = useState<ContentType>(ContentType.Youtube);
        const [menuOpen, setMenuOpen] = useState(false);
        const typeOptions: { label: string; value: ContentType }[] = [
            { label: "YouTube", value: ContentType.Youtube },
            { label: "Twitter", value: ContentType.Twitter },
        ];
        const currentLabel = typeOptions.find(o => o.value === type)?.label ?? "Select type";
    function addcontent(){
        const title = (titleref.current?.value ?? "").trim();
        const link = (linkref.current?.value ?? "").trim();
        // For now, just log the values and close; integrate API call as needed
        console.log("Submitting content:", { title, link, type });
        onClose?.();
    }
return( <div>
    {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center">
        <div className="flex flex-col justify-center">
            <span className=" bg bg-white opacity-100 p-4 rounded-sm"><div className="flex justify-end" onClick={onClose} ><CrossIcon/></div>
<div>
    <Input variant="primary" ref={titleref} placeholder={"Title"}/>
    <Input variant="primary" ref={linkref} placeholder={"Link"}/>
                        {/* Type selector */}
                        <div className="relative mt-3">
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
                                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${opt.value === type ? 'bg-gray-50 font-medium' : ''}`}
                                            onClick={() => { setType(opt.value); setMenuOpen(false); }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
</div>
<div className="flex justify-center">
    <Button variant="primary" size="md" text="submit" onClick={addcontent}></Button>
</div>
            </span>
        </div>
        </div>
    }
     
</div>)
}