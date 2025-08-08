import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Signup(){
    return (
        <div className="h-screen w-screen bg-gray-500 flex justify-center items-center">
            <div className="max-w-72 w-full border border-gray-300/20 shadow-md bg-amber-50 rounded-lg p-10">
                <div className="flex flex-col gap-4">
                    <Input placeholder="UserName"  />
                    <Input placeholder="Password"  />
                </div>
                <div className="flex justify-center items-center mt-6">
                    <Button variant="primary" text="Signup" size="full" />
                </div>
            </div>
        </div>
    );
}