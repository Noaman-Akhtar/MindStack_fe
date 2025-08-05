import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Signup(){
    return <>
    <div className="h-screen w-screen bg-gray-500 flex justify-center items-center">
        <div className="max-w-72 border border-gray-300/20 shadow-md bg-amber-50 rounded-lg px-10 py-10">
           
           <div className="mr-10"> <Input placeholder="UserName" 
            />
            <Input placeholder="Password" />
</div>
            <Button variant="primary" text="Signup" size="md"/>
        </div>

    </div>
    </>
}