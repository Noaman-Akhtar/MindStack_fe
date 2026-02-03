import { NavBar } from "../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FeatureCard } from "../components/ui/FeatureCard";
import { IoLogoGithub } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import { WordRotator } from "../components/ui/wordRotator";
import { SocialLink } from "../components/ui/Links";
import { BsTwitterX } from "react-icons/bs";


export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Capture Everything in Seconds",
      description:
        "Save links, notes, documents, and rich content. Everything organized in beautiful cards. Add titles, descriptions, write formatted notes, and attach files—all in one simple modal.",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      title: "Smart Semantic Search",
      description:
        "Find anything with natural language. AI understands meaning, not just keywords. Search 'productivity tips' and find notes about morning routines, focus techniques, and time management—even without exact matches.",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      title: "Beautiful Content Viewing",
      description:
        "Click any card to see everything in one place. Embedded YouTube videos play inline, Twitter posts display beautifully, and documents preview instantly. All your content, perfectly formatted.",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      title: "Edit Anything, Anytime",
      description:
        "Update your notes with the rich text editor. Add formatting, attach more documents, reorganize content—changes save instantly. Keep your knowledge base fresh and organized.",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#07070f] text-[#e8e8e8] overflow-x-hidden">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16">
        {/* HERO SECTION  */}
        <div className="mt-14 space-y-4">
          <div className="text-[#cdcdcd]">
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-snug">
              Your Second Brain,
            </h1>
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-snug">
              Powered by <span className="text-[#cbaefd]">AI.</span>
            </h1>
          </div>

          <div className="text-lg mt-6 sm:text-xl xl:text-3xl lg:text-2xl font-light text-gray-400 max-w-3xl">
            <p>Store notes, links, and documents securely in the cloud.</p>
            <p>
              Find anything instantly with highly accurate semantic search and
              AI assistance.
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 text-xl font-medium rounded-lg bg-[#2D2B55] text-[#C4C2FF] hover:bg-[#454379] transition-all duration-300 ease-in-out"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Dashboard Image Section */}
        <div className="flex items-center justify-center w-full mt-16 mb-20">
          <img
            src={assets.laptop}
            alt="Landing Page Visual"
            className="max-w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* FEATURES SECTION */}
        <section className="py-16 border-t border-gray-800/50">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#cdcdcd]">
              Features & How It Works
            </h2>
            <p className="hidden lg:block text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Hover over each card to see them in action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="py-25 border-t mt-20 border-gray-800/50 mb-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#cdcdcd]">
              Built for the Way You Work
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Whether you're learning, creating, or organizing—MindStack adapts
              to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:px-10">
            {/* Use Case 1 */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-2xl font-semibold text-[#cdcdcd] border-l-4 border-[#cbaefd] pl-4">
                Learning & Research
              </h3>
              <p className="text-lg text-gray-400 pl-5">
                Save articles, papers, and lectures. Perfect for students and
                researchers building their knowledge base.
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-2xl font-semibold text-[#cdcdcd] border-l-4 border-[#cbaefd] pl-4">
                Developer's Hub
              </h3>
              <p className="text-lg text-gray-400 pl-5">
                Store code snippets, docs, and tutorials. Your personal
                programming reference library.
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-2xl font-semibold text-[#cdcdcd] border-l-4 border-[#cbaefd] pl-4">
                Content Creation
              </h3>
              <p className="text-lg text-gray-400 pl-5">
                Collect inspiration, quotes, and references. Build your swipe
                file and never lose ideas.
              </p>
            </div>

            {/* Use Case 4 */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-2xl font-semibold text-[#cdcdcd] border-l-4 border-[#cbaefd] pl-4">
                Personal Organization
              </h3>
              <p className="text-lg text-gray-400 pl-5">
                Journal thoughts, manage projects, and organize hobbies.
                Everything searchable in one place.
              </p>
            </div>
          </div>
        </section>
      </main>
      {/* FINAL CTA SECTION */}
      <section className="py-16  text-center  ">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3  ml-10  mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#cdcdcd]">
            Built to help you
          </h2>

          <WordRotator
            words={["Store.", "Remember.", "Search.", "Organise."]}
            interval={2500}
            className="text-3xl md:text-4xl font-bold text-[#cbaefd]"
            wrapperClassName="flex items-center justify-center md:justify-start h-16 md:h-16 overflow-hidden w-full md:w-[200px]"
          />
        </div>

        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-4 text-xl font-medium rounded-lg bg-[#2D2B55] text-[#C4C2FF] hover:bg-[#454379] transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg shadow-[#2D2B55]/30"
        >
          Get Started Now
        </button>
      </section>
      {/* FOOTER */}
      <footer className="w-full mt-10 border-t border-gray-800/50 py-5 bg-[#05050a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        
          <div className="text-gray-500 text-sm">
            © 2025 MindStack
          </div>

          {/* Right Side: Social Links */}

          <div className="flex items-center gap-2">
            <SocialLink
              href="https://github.com/yourusername"
              icon={IoLogoGithub}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com/in/yourusername"
              icon={FaLinkedin}
              label="LinkedIn"
            />
            <SocialLink
              href="https://twitter.com/yourusername"
              icon={BsTwitterX}
              label="Twitter"
            />
            <SocialLink
              href="https://discord.gg/yourserver"
              icon={BsDiscord}
              label="Discord"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
