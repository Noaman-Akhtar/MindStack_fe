import React from "react";
import { NavBar } from "../components/ui/NavBar";
import { Button } from "../components/ui/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export function LandingPage(){
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen w-full bg-[#07070f] text-[#e8e8e8] ">
        <NavBar />
        <div className="text-[#cdcdcd]  ml-15  mt-20">
          <div className="text-6xl  font-medium">Your Second Brain,</div>
          <div className="text-6xl font-medium">Powered by AI.</div>
          <div className="text-4xl font-normal mt-8">
            Store notes, links, and documents.
            <div>Find anything instantly with semantic search.</div>
          </div>
          <div onClick={() => navigate("/signup")}>
            <button className="w-50 h-13 mt-10 text-2xl hover:bg-[#454379] font-stretch-extra-expanded font-medium rounded-lg cursor-pointer  bg-[#2D2B55] text-[#C4C2FF]">
              Get Started
            </button>
          </div>
        </div>
        <div className="w-200 ml-50 mt-23"><img src={assets.laptop} alt="Landing Page Visual"/></div>
      </div>
    </>
  );
}
