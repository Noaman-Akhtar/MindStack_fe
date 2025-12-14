import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Store", "Remember", "Search", "Organise"];

export const WordRotator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-16 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]} // Key is crucial for Framer Motion to know it's a new element
          initial={{ y: 20, opacity: 0 }} // Start below and invisible
          animate={{ y: 0, opacity: 1 }}  // Move to center and visible
          exit={{ y: -20, opacity: 0 }}   // Move up and fade out
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-4xl md:text-6xl font-bold text-[#cbaefd] inline-block"
        >
          {words[index]}.
        </motion.span>
      </AnimatePresence>
    </div>
  );
};