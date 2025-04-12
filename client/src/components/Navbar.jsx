import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, setIsLoggedin, setUserData } =
    useContext(AppContent);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getInitial = () => {
    if (userData?.name) return userData.name[0].toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "U";
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

      {/* Action Buttons or User Icon */}
      <div className="relative flex items-center gap-2 sm:gap-4 text-sm">
        {!isLoggedin ? (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-5 py-2 border border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow shadow-cyan-500/30"
          >
            Login
            <img src={assets.arrow_icon} alt="Arrow" className="w-3 h-3" />
          </button>
        ) : (
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 flex items-center justify-center bg-black text-white font-bold rounded-full cursor-pointer hover:opacity-90 transition"
              title={userData?.email}
            >
              {getInitial()}
            </div>

            {showDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
                {!userData?.isAccountVerified && (
                  <li
                    onClick={() => {
                      verifyEmail();
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-yellow-100 cursor-pointer border-b border-gray-200 text-sm"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
