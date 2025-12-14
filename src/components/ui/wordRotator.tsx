import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordRotatorProps {
    words?: string[];
    interval?: number;
    className?: string;
    wrapperClassName?: string;
}


export const WordRotator:React.FC<WordRotatorProps> = ({words,interval=2500,className="text-4xl md:text-6xl font-bold text-[#cbaefd]",wrapperClassName="flex items-center justify-center h-16 overflow-hidden"}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if(!words || words.length===0) return;
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval); 

    return () => clearInterval(timer);
  }, [words,interval]);

  return (
    <div className={wrapperClassName}>
      <AnimatePresence mode="wait">
        {words && words.length > 0 && (
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
        )}
      </AnimatePresence>
    </div>
  );
};