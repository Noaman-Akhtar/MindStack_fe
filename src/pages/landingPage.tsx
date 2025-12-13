
import { NavBar } from "../components/ui/NavBar";
import {useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {FeatureCard} from "../components/ui/FeatureCard";

export function LandingPage(){
  const navigate = useNavigate();

  const features = [
  {
    title: "Capture Everything in Seconds",
    description: "Save links, notes, documents, and rich content. Everything organized in beautiful cards. Add titles, descriptions, write formatted notes, and attach files—all in one simple modal.",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    title: "Smart Semantic Search",
    description: "Find anything with natural language. AI understands meaning, not just keywords. Search 'productivity tips' and find notes about morning routines, focus techniques, and time management—even without exact matches.",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  {
    title: "Beautiful Content Viewing",
    description: "Click any card to see everything in one place. Embedded YouTube videos play inline, Twitter posts display beautifully, and documents preview instantly. All your content, perfectly formatted.",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    title: "Edit Anything, Anytime",
    description: "Update your notes with the rich text editor. Add formatting, attach more documents, reorganize content—changes save instantly. Keep your knowledge base fresh and organized.",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  }
];


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
        {/* features section */}
      
      <div className=" mx-16 pb-10 mt-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl 2xl:text-7xl font-bold text-[#cdcdcd]  mb-4">Features & How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl 2xl:text-3xl mx-auto">Hover over each card to see them in action.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1  md:mx-6  lg:mx-8 2xl:mt-16  mt-10 lg:grid-cols-2 gap-20">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
      {/* <div className="text-[#cdcdcd] flex justify-between gap-8  ml-8 sm:ml-12 md:ml-12 lg:ml-22  mt-14">
        <div>
           <p className="md:text-2xl  text-xl lg:text-3xl text-[#cdcdcd] 2xl:text-5xl font-medium">Cloud Sync</p>
        <p className="mt-3 text-md  text-gray-400  sm:text-xl  lg:text-lg  2xl:text-2xl font-normal sm:mt-4 md:mt-6  2xl:mt-8">
          Access your knowledge base from anywhere. MindStack syncs your data securely across all devices, so your second brain is always with you.
        </p>
        </div>
         <div className="hidden md:block w-1 bg-gray-400/30 h-28  self-center" />
        <div>
           <p className="md:text-2xl  text-xl lg:text-3xl text-[#cdcdcd]  2xl:text-5xl font-medium">Privacy First</p>
        <p className="mt-3 text-md  text-gray-400 sm:text-xl mr-6 lg:text-lg 2xl:text-2xl  font-normal sm:mt-4 md:mt-6  2xl:mt-8">
          Your data is yours alone. We prioritize your privacy with end-to-end encryption and zero-knowledge architecture, ensuring only you can access your information.
        </p>
        </div>
       
      </div> */}
 {/* Use Cases Section */}
<div className="mx-8 sm:mx-12 md:mx-16 lg:mx-20 pb-12 mt-16">
  <div className="text-center mb-8">
    <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-[#cdcdcd] mb-3">
      Built for the Way You Work
    </h2>
    <p className="text-base text-gray-400 max-w-2xl 2xl:text-xl mx-auto">
      Whether you're learning, creating, or organizing—MindStack adapts to your workflow.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16  ml-6 sm:ml-8 md:ml-12 lg:ml-15 ">
    {/* Use Case 1 */}
    <div>
      <h3 className="text-lg md:text-xl 2xl:text-2xl font-semibold text-[#cdcdcd] mb-2">
         Learning & Research
      </h3>
      <p className="text-sm md:text-lg 2xl:text-lg text-gray-400">
        Save articles, papers, and lectures. Perfect for students and researchers building their knowledge base.
      </p>
    </div>

    {/* Use Case 2 */}
    <div>
      <h3 className="text-lg md:text-xl 2xl:text-2xl font-semibold text-[#cdcdcd] mb-2">
         Developer's Hub
      </h3>
      <p className="text-sm md:text-lg  2xl:text-lg text-gray-400">
        Store code snippets, docs, and tutorials. Your personal programming reference library.
      </p>
    </div>

    {/* Use Case 3 */}
    <div>
      <h3 className="text-lg md:text-xl 2xl:text-2xl font-semibold text-[#cdcdcd] mb-2">
         Content Creation
      </h3>
      <p className="text-sm md:text-lg 2xl:text-lg text-gray-400">
        Collect inspiration, quotes, and references. Build your swipe file and never lose ideas.
      </p>
    </div>

    {/* Use Case 4 */}
    <div>
      <h3 className="text-lg md:text-xl 2xl:text-2xl font-semibold text-[#cdcdcd] mb-2">
         Personal Organization
      </h3>
      <p className="text-sm md:text-lg 2xl:text-lg text-gray-400">
        Journal thoughts, manage projects, and organize hobbies. Everything searchable in one place.
      </p>
    </div>
  </div>
</div>
      
      </div>
    
     
    </>
  );
}
