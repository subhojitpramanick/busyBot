import React from "react";

const WatchDemo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-pink-500 drop-shadow-lg animate-fade-in">
        🚀 Watch BusyBot Demo
      </h1>
      <p className="mb-8 text-xl text-slate-700 text-center max-w-2xl animate-fade-in delay-100">
        See BusyBot in action and learn how to get the most out of our AI tools!
        Discover features, tips, and a walkthrough in this quick demo.
      </p>
      <div className="relative w-full max-w-2xl aspect-video flex items-center justify-center group animate-fade-in delay-200">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-pink-400 blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-0"></div>
        <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-transparent group-hover:border-fuchsia-400 transition-all duration-300">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
            title="Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
      <a
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-fuchsia-500 hover:to-pink-600 transition-all duration-300 animate-fade-in delay-300"
      >
        Watch on YouTube
      </a>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default WatchDemo;
