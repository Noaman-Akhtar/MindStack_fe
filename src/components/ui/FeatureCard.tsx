import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FeatureCardProps {
  title: string;
  description: string;
  videoSrc: string;
}

export const FeatureCard = ({ title, description, videoSrc }: FeatureCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const handleMouseEnter = () => {
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      videoRef.current.play();
    }
  };
  const handleMouseLeave = () => {
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // gsap.to(videoRef.current, { currentTime: 0, duration: 0.5, overwrite: true });
          videoRef.current?.pause();
          videoRef.current!.currentTime = 0;
        },
      });
    }
  };

  return (
    <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col h-full  overflow-hidden rounded-2xl bg-[#21213d] transition-all duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_4px_20px_rgba(0,0,0,0.5)]">
    <div 
    ref={lightRef}
    className="pointer-events-none absolute inset-0 opacity-0 flex-1 transition-opacity duration-300 group-hover:opacity-100 blur-[40px] bg-[radial-gradient(circle_300px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.08),transparent_100%)]"/>
    <div className="relative z-10 p-6 pr-8">
     <h3 className="mb-3 text-2xl  2xl:text-4xl font-bold text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed  2xl:text-2xl max-w-md">{description}</p>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black ml-8 mr-4 mt-auto rounded-lg">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-80" 
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />   
    </div>
    </div>
    )
};
