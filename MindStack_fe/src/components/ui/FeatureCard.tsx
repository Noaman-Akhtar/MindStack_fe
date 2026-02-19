import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FeatureCardProps {
  title: string;
  description: string;
}

export const FeatureCard = ({ title, description }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const xSet = gsap.quickSetter(lightRef.current, "--mouse-x", "px");
    const ySet = gsap.quickSetter(lightRef.current, "--mouse-y", "px");

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      xSet(e.clientX - rect.left);
      ySet(e.clientY - rect.top);
    };
    const card = cardRef.current;
    card?.addEventListener("mousemove", handleMouseMove);

    return () => {
      card?.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return (
    <div
        ref={cardRef}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-[#21213d] transition-all duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_4px_20px_rgba(0,0,0,0.5)]">
    <div 
    ref={lightRef}
    className="pointer-events-none absolute inset-0 opacity-0 flex-1 transition-opacity duration-300 group-hover:opacity-100 blur-[40px] bg-[radial-gradient(circle_300px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.08),transparent_100%)]"/>
    <div className="relative z-10 p-6 pr-8">
     <h3 className="mb-3 text-2xl 2xl:text-4xl font-bold text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed 2xl:text-2xl max-w-md">{description}</p>
      </div>
    </div>
    )
};
