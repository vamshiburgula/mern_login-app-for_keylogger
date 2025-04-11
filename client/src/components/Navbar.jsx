import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, setIsLoggedin, setUserData } =
    useContext(AppContent);

  const verifyEmail = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success("Verification email sent!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification"
      );
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 sm:px-20 py-4 fixed top-0 z-50 bg-[#0b0f1edc] backdrop-blur-md border-b border-cyan-800 shadow-md shadow-cyan-500/10 font-mono">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="w-28 sm:w-32 cursor-pointer hover:opacity-90 transition-opacity duration-300"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 text-sm">
        {!isLoggedin && (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-5 py-2 border border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow shadow-cyan-500/30"
          >
            Login
            <img src={assets.arrow_icon} alt="Arrow" className="w-3 h-3" />
          </button>
        )}

        {isLoggedin && userData && !userData.isAccountVerified && (
          <button
            onClick={verifyEmail}
            className="flex items-center gap-2 px-5 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-md shadow-yellow-500/40"
          >
            <img src={assets.mail_icon} alt="Verify" className="w-4 h-4" />
            Verify Email
          </button>
        )}

        {isLoggedin && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2 border border-red-500 text-red-400 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow shadow-red-500/30"
          >
            <img src={assets.logout_icon} alt="Logout" className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
