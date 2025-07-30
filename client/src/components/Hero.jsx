import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
const Hero = () => {
  // Handler for the "Start Creating" button
  const handleStartCreating = () => {
    navigate("/ai");
    // TODO: Add your logic here
  };

  // Handler for the "Watch Demo" button
  const handleWatchDemo = () => {
    navigate("/watch-demo");
  };
  const navigate = useNavigate();
  return (
    // Main flex container to center the content
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center items-center bg-[url('/gradientBackground.png')] bg-cover bg-center bg-no-repeat min-h-screen">
      <div className="max-w-4xl text-center">
        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
          Stop Chasing Inspiration.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Command It.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto mt-6 text-lg font-medium text-slate-600 md:text-xl">
          <span className="font-bold text-slate-800">BusyBot</span> gives you
          the AI-powered arsenal to turn fleeting ideas into high-impact
          content. The only limit is your ambition.
        </p>

        {/* Container for the two action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
          {/* Primary Button: "Start Creating" */}
          <style>{`
            @keyframes rotate {
                100% {
                    transform: rotate(1turn);
                }
            }
            .rainbow::before {
                content: '';
                position: absolute;
                z-index: -2;
                left: -50%;
                top: -50%;
                width: 200%;
                height: 200%;
                background-position: 100% 50%;
                background-repeat: no-repeat;
                background-size: 50% 30%;
                filter: blur(6px);
                background-image: linear-gradient(#FF0A7F,#780EFF);
                animation: rotate 4s linear infinite;
            }
          `}</style>
          <div className="rainbow relative z-0 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button
              onClick={handleStartCreating}
              className="px-10 py-4 text-lg font-bold text-white bg-slate-900 rounded-full shadow-lg transition-all duration-300 transform hover:bg-slate-700"
            >
              Start Creating
            </button>
          </div>

          {/* Secondary Button: "Watch Demo" */}
          <button
            onClick={handleWatchDemo}
            className="px-10 py-4 text-lg font-bold text-slate-800 transition-all duration-300 transform bg-transparent border-2 border-slate-800 rounded-full hover:bg-slate-900 hover:text-white hover:scale-105"
          >
            Watch Demo
          </button>
        </div>
        {/* User group info */}
        <div
          className="flex items-center justify-center gap-2 mt-8 text-slate-500 bg-white/70 rounded-full px-4 py-2 shadow-md w-fit mx-auto cursor-pointer"
          onClick={() => {
            const testimonialSection = document.getElementById(
              "testimonial-section"
            );
            if (testimonialSection) {
              testimonialSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <img src={assets.user_group} alt="User group" className="h-8" />
          <span className="font-medium">Trusted by 1000+ users worldwide.</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
