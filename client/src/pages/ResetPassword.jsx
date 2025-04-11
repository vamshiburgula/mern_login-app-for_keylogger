import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black px-6 sm:px-0 relative">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]"
      />

      {/* EMAIL ENTRY FORM */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-[#0f172a] border border-cyan-500/30 p-8 rounded-lg shadow-xl w-96 text-sm text-white backdrop-blur-md"
        >
          <h1 className="text-cyan-400 text-2xl font-semibold text-center mb-4 tracking-wide">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-slate-400 text-sm">
            Enter registered email address to receive OTP
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-md bg-slate-800 border border-slate-700">
            <img src={assets.mail_icon} alt="Mail" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none text-cyan-100 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white rounded-md shadow-md transition duration-200"
          >
            Send OTP
          </button>
        </form>
      )}

      {/* OTP ENTRY FORM */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-[#0f172a] border border-cyan-500/30 p-8 rounded-lg shadow-xl w-96 text-sm text-white backdrop-blur-md"
        >
          <h1 className="text-cyan-400 text-2xl font-semibold text-center mb-4 tracking-wide">
            Enter OTP
          </h1>
          <p className="text-center mb-6 text-slate-400">
            Enter the 6-digit verification code sent to your email
          </p>

          <div
            className="flex justify-between gap-2 mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-10 h-12 bg-slate-800 border border-slate-700 text-cyan-100 text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white rounded-md shadow-md transition duration-200">
            Verify OTP
          </button>
        </form>
      )}

      {/* NEW PASSWORD FORM */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-[#0f172a] border border-cyan-500/30 p-8 rounded-lg shadow-xl w-96 text-sm text-white backdrop-blur-md"
        >
          <h1 className="text-cyan-400 text-2xl font-semibold text-center mb-4 tracking-wide">
            Set New Password
          </h1>
          <p className="text-center mb-6 text-slate-400">
            Enter a secure new password
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-md bg-slate-800 border border-slate-700">
            <img src={assets.lock_icon} alt="Lock" className="w-4 h-4" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-cyan-100 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white rounded-md shadow-md transition duration-200"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
