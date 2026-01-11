import { useEffect,useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signin() {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard")
        }
    }, [])
    async function signin() {
        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value;
        try{
             const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            username,
            password
        });
        const jwt = response.data.token;
        localStorage.setItem("token", jwt);
        navigate("/dashboard");
        }
        catch (err: any) {
                setError("Incorrect credentials");  
        }
    }
    return (
        <div className=" signup-bg h-screen w-screen bg-black flex justify-center items-center">
            <div className="blur-ellipse"></div>
            <div className="fixed max-w-82 h-82 m-2 w-full border border-gray-300/20 shadow-md bg-[#303060]/20 rounded-lg p-6 ">
                <div className="flex flex-col  mt-6 gap-y-10">
                    <Input variant="secondary" ref={usernameRef} placeholder="UserName" type="text" />
                    <Input variant="secondary" ref={passwordRef} placeholder="Password" type="password" />
                </div>
                <div className="flex justify-center items-center mt-25">
                    <Button variant="primary" text="Signin" size="full" onClick={signin} loading={false} />
                </div>
                {error.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mt-4">
                        <div className="text-red-400 text-sm space-y-1">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}