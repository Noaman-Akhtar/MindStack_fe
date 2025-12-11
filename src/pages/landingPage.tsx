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
        <div className="text-[#cdcdcd]  ml-6 sm:ml-8 md:ml-12 lg:ml-15  mt-14">
          <div className="md:text-4xl  text-3xl lg:text-6xl xl:text-7xl font-medium">Your Second Brain,</div>
          <div className="md:text-4xl  text-3xl lg:text-6xl xl:text-7xl font-medium">Powered by <span className="text-[#cbaefd]">AI.</span></div>
          <div className="text-lg mt-6 sm:text-xl xl:text-4xl lg:text-3xl font-normal sm:mt-8 md:mt-10 lg:mt-12 xl:mt-8">
            Store notes, links, and documents.
            <div>Find anything instantly with semantic search.</div>
          </div>
          <div onClick={() => navigate("/signup")}>
            <button className="max-w-full text-sm  max-h-full p-2 sm:p-2 md:p-2 lg:text-2xl lg:p-2  xl:px-5 xl:text-2xl mt-18 text-2xl hover:bg-[#454379] font-stretch-extra-expanded font-medium rounded-lg cursor-pointer  bg-[#2D2B55] text-[#C4C2FF]">
              Get Started
            </button>
          </div>
        </div>
       <div className="hidden lg:flex items-center justify-center w-full lg:p-8  mt-12">
          <img src={assets.laptop} alt="Landing Page Visual" className="max-w-full h-auto" />
        </div>
      </div>
    </>
  );
}
