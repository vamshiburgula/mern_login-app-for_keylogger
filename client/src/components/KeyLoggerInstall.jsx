import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";

const KeyloggerInstall = () => {
  const { userData } = useContext(AppContent);

  const downloadKeylogger = () => {
    // This would trigger a download of the Python keylogger executable
    // You would need to compile the Python script to an executable first
    alert("Download would start here");
  };

  return (
    <div className="bg-[#1a1f2e] p-6 rounded-lg border border-cyan-800 shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">
        Keylogger Installation
      </h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Step 1: Download the Keylogger</h3>
        <button
          onClick={downloadKeylogger}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
        >
          Download Installer
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Step 2: Installation Instructions
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Run the downloaded installer</li>
          <li>Follow the installation wizard</li>
          <li>Restart your computer when prompted</li>
        </ol>
      </div>

      <div className="bg-slate-800 p-4 rounded border border-slate-700">
        <h4 className="font-semibold text-yellow-400 mb-2">Note:</h4>
        <p className="text-sm">
          The keylogger will run in the background and automatically start with
          your system. It will securely transmit data to your dashboard.
        </p>
      </div>

      {userData?.keyloggerInstalled && (
        <div className="mt-6 p-4 bg-green-900/30 rounded border border-green-700">
          <p className="text-green-400 flex items-center gap-2">
            <img src={assets.check_icon} alt="Check" className="w-4 h-4" />
            Keylogger is installed and active
          </p>
        </div>
      )}
    </div>
  );
};

export default KeyloggerInstall;
