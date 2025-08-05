import { Button } from "./Button";
import { CrossIcon } from "./icons/CrossIcon";
import { Input } from "./Input";

interface CreateContentModalProps{
    open:boolean;
    onClose?:() => void;
}

export function CreateContentModal({open,onClose}:CreateContentModalProps){
return <div>
    {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center">
        <div className="flex flex-col justify-center">
            <span className=" bg bg-white opacity-100 p-4 rounded-sm"><div className="flex justify-end" onClick={onClose} ><CrossIcon/></div>
<div>
    <Input placeholder={"Title"}/>
    <Input placeholder={"Link"}/>
</div>
<div className="flex justify-center">
    <Button variant="primary" size="md" text="submit"></Button>
</div>
            </span>
        </div>
        </div>
    }
     
</div>
}