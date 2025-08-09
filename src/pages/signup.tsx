import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Signup(){
    return (
        <div className=" signup-bg h-screen w-screen bg-black flex justify-center items-center">
            <div className="blur-ellipse"></div>
            <div className="fixed max-w-96 h-80 m-2 w-full border border-gray-300/20 shadow-md bg-[#303060]/20 rounded-lg p-6 ">
                <div className="flex flex-col  mt-8 gap-y-6">
                    <Input placeholder="UserName"  />
                    <Input placeholder="Password"  />
                </div>
                <div className="flex justify-center items-center mt-15">
                    <Button variant="primary" text="Signup" size="full" onClick={Signup} loading={false} />
                
            </div>
            </div>
        </div>
    );
}