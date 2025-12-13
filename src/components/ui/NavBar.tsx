import { Logo } from "../icons/MindStacklogo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function NavBar(){
    const navigate = useNavigate();
    const [mobileOpen,setmobileOpen]=useState(false);
    
    const scrollToTop = () => {
        window.scrollTo({ top:0, behavior:"smooth"});
    };
const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    return(
        <div className={`fixed top-0 left-0 right-0 z-50  transition-transform duration-300 ease-in-out ${scrolled ? "translate-y-0 border-b border-gray-700/50 shadow-sm" : "translate-y-5 border-b border-transparent"}`}>
            <nav className="bg-[#07070f] text-[#bbbbbb] flex justify-between items-center">
                <div className="flex items-center gap-3 ml-11 p-2 xl:p-0 cursor-pointer  " onClick={scrollToTop}>
                    <div>
                        <Logo/> 
                    </div>
                    
                    <span className="text-[#ececec] text-2xl font-bold mb-2 hover:text-[#d4bbff] ">Mindstack</span>
                </div>
                {/* desktop */}
                <div className="hidden md:flex gap-8 pr-5 text-lg font-medium cursor-pointer">
                    <p className="hover:text-[#f1f1f1]">Features</p>
                    <p className="hover:text-[#f1f1f1]" onClick={() => navigate("/signin")}>Sign In</p>
                    <span onClick={()=>navigate("/signup")}>
                        <p className="hover:text-[#f1f1f1]">Sign Up</p>
                    </span>
                   
                </div>
                {/*mobile*/}
                <button aria-label="Toggle navigation" className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md border border-gray-600 hover:border-gray-400 hover:bg-[#1b1b2a] transition-colors" onClick={()=>setmobileOpen(v=>!v)}>
                    <span className="block w-5 h-0.5 bg-gray-300 mb-1"/>
                    <span className="block w-5 h-0.5 bg-gray-300 mb-1"/>
                    <span className="block w-5 h-0.5 bg-gray-300 "/>
                </button>
            </nav>
                {mobileOpen && (
                    <div className="md:hidden bg-[#06060c] text-[#bbbbbb] border-t border-gray-700/40 px-4 pb-4 space-y-4">
                        <p onClick={()=>{setmobileOpen(false)}}>
                            Features
                        </p>
                        <p onClick={()=>{setmobileOpen(false);navigate("/signin")}}>
                            Sign In
                        </p>
                        <span onClick={()=>{setmobileOpen(false);navigate("/signup")}}>
                            <p> Sign Up </p>
                        </span>
                    </div>
                )}

        </div>
    );
}