import { Logo } from "../icons/MindStacklogo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function NavBar() {
  const navigate = useNavigate();
  const [mobileOpen, setmobileOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ease-in-out ${
        scrolled
          ? "translate-y-0 border-b border-gray-700/50 shadow-sm bg-[#07070f]/95 backdrop-blur-sm"
          : "translate-y-4 border-b border-transparent "
      }`}
    >
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <nav className="text-[#bbbbbb] flex justify-between items-center h-16">
          
          {/* Logo Section - Removed ml-11 to let container handle alignment */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
            <div>
              <Logo />
            </div>
            <span className="text-[#ececec] text-2xl font-bold mb-2 hover:text-[#d4bbff]">
              Mindstack
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex gap-8 items-center text-lg font-medium cursor-pointer">
            <p className="hover:text-[#f1f1f1]">Features</p>
            <p className="hover:text-[#f1f1f1]" onClick={() => navigate("/signin")}>
              Sign In
            </p>
            <span onClick={() => navigate("/signup")}>
              <p className="hover:text-[#f1f1f1] px-4 py-2 rounded-md hover:bg-[#1b1b2a] transition-colors">
                Sign Up
              </p>
            </span>
          </div>

          {/* Mobile Toggle Button */}
          <button
            aria-label="Toggle navigation"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md border border-gray-600 hover:border-gray-400 hover:bg-[#1b1b2a] transition-colors"
            onClick={() => setmobileOpen((v) => !v)}
          >
            <span className="block w-5 h-0.5 bg-gray-300 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-300 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-300" />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#06060c] text-[#bbbbbb] border-t border-gray-700/40 px-6 py-4 space-y-4 shadow-xl">
          <p
            className="block py-2 hover:text-white"
            onClick={() => {
              setmobileOpen(false);
            }}
          >
            Features
          </p>
          <p
            className="block py-2 hover:text-white"
            onClick={() => {
              setmobileOpen(false);
              navigate("/signin");
            }}
          >
            Sign In
          </p>
          <span
            className="block py-2 hover:text-white font-semibold text-[#d4bbff]"
            onClick={() => {
              setmobileOpen(false);
              navigate("/signup");
            }}
          >
            <p> Sign Up </p>
          </span>
        </div>
      )}
    </div>
  );
}