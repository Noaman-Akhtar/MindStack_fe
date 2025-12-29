import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signup() {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard")
        }
    }, [])
    async function signup() {
        setError("");
        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value;
        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            });
            navigate("/signin");
        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                setError("Username already exists");
            } else {
                setError("Signup failed. Please try again.");
            }
        }
    }
    return (
        <div className=" signup-bg h-screen w-screen bg-black flex justify-center items-center">
            <div className="blur-ellipse"></div>
            <div className="fixed max-w-96 h-80 m-2 w-full border border-gray-300/20 shadow-md bg-[#303060]/20 rounded-lg p-6 ">
                <div className="flex flex-col  mt-8 gap-y-6">
                    <Input variant="secondary" ref={usernameRef} placeholder="UserName" type="text" />
                    <Input variant="secondary" ref={passwordRef} placeholder="Password" type="password" />
                </div>
                <div className="flex justify-center items-center mt-15">
                    <Button variant="primary" text="Signup" size="full" onClick={signup} loading={false} />
                </div>
                {error && (
                    <div className="text-red-500 text-center mt-4">{error}</div>
                )}
            </div>
        </div>
    );
}