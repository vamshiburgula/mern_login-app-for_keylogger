import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#0b0f1e] text-white font-mono relative overflow-hidden">
      {/* Cyber Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-90 z-0" />

      {/* Patterned Background for Texture */}
      <div
        className="absolute inset-0 bg-[url('/bg_img.png')] bg-cover bg-center opacity-10 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Animated Glow Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-20 px-4">
        <Navbar />
        <Header />
      </div>
    </div>
  );
};

export default Home;
