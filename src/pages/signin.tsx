import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signin(){
    const navigate = useNavigate();
const usernameRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);
    async function signin(){
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
       const response = await axios.post(BACKEND_URL+ "/api/v1/signin",{
            username,
            password
        });
        const jwt = response.data.token;
        localStorage.setItem("token",jwt);
        //redirect to dashboard 
navigate("/dashboard");
        alert("you have signin up!");
    }
    return (
        <div className=" signup-bg h-screen w-screen bg-black flex justify-center items-center">
            <div className="blur-ellipse"></div>
            <div className="fixed max-w-96 h-80 m-2 w-full border border-gray-300/20 shadow-md bg-[#303060]/20 rounded-lg p-6 ">
                <div className="flex flex-col  mt-8 gap-y-6">
                    <Input variant="secondary" ref={usernameRef} placeholder="UserName" type="text"  />
                    <Input variant="secondary" ref={passwordRef} placeholder="Password" type="password" />
                </div>
                <div className="flex justify-center items-center mt-15">
                    <Button variant="primary" text="Signin" size="full" onClick={signin} loading={false} />
                
            </div>
            </div>
        </div>
    );
}