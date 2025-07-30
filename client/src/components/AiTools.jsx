import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// Assuming you have a data file for AI tools
const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      <div className="text-center">
        {/* ✨ Enhanced Gradient Header */}
        <h2 className="font-extrabold text-5xl mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
          Powerful AI Tools
        </h2>
        {/* Improved text color for better readability */}
        <p className="text-gray-600 max-w-lg mx-auto">
          Explore our suite of AI tools designed to enhance your productivity
          and creativity. From content generation to data analysis, we have the
          right tool for you.
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-16 gap-8">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            // ✨ Enhanced card with smoother transitions, a "lift" effect, and a subtle glow on hover
            className="p-8 m-4 max-w-xs rounded-2xl bg-[#f8f9fa] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group"
            onClick={() => user && navigate(tool.path)}
          >
            <div
              className="w-14 h-14 p-3.5 text-white rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            >
              <tool.Icon className="w-full h-full" />
            </div>
            <h3 className="mt-6 mb-3 text-lg font-semibold text-slate-800">
              {tool.title}
            </h3>
            <p className="text-gray-500 text-sm max-w-[95%]">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
