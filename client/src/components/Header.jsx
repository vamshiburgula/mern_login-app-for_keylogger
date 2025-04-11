import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContent);

  return (
    <div className="w-full max-w-3xl mx-auto mt-32 p-6 sm:p-10 rounded-xl backdrop-blur-md bg-[#0a0f1ae6] border border-cyan-900 shadow-lg shadow-cyan-500/10 text-center text-white font-mono">
      <img
        src={assets.header_img}
        alt="Header"
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6 border-4 border-cyan-400 shadow-md shadow-cyan-500/30"
      />

      <h1 className="text-xl sm:text-3xl text-cyan-300 font-semibold flex items-center justify-center gap-2 mb-2">
        Hey {userData?.name || "User"}!
        <img
          src={assets.hand_wave}
          alt="Wave"
          className="w-6 sm:w-8 h-auto animate-wiggle"
        />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-bold text-[#00ffcc] drop-shadow-md mb-4">
        Welcome to CyberCore
      </h2>

      <p className="text-gray-400 max-w-md mx-auto mb-8">
        Plug into the core. Stay encrypted. Stay secure.
      </p>

      <button className="px-8 py-3 rounded-full border border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black transition-all duration-300 shadow-md shadow-[#00ffcc]/40">
        Get Started
      </button>
    </div>
  );
};

export default Header;
