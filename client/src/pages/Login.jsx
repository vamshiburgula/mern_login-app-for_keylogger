import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = state === "Sign Up" ? "register" : "login";
      const payload =
        state === "Sign Up" ? { name, email, password } : { email, password };

      const { data } = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-[#0f0f1a] via-[#121222] to-[#1a1a2e] relative overflow-hidden">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:opacity-80 transition-all"
      />

      <div className="w-full max-w-md bg-[#141628] border border-[#2e324a] text-[#00ffcc] rounded-xl shadow-2xl p-8 sm:p-10 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-widest">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          {state === "Sign Up"
            ? "Join the secure zone"
            : "Access your secure dashboard"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#1e213a] border border-[#2e324a]">
              <img src={assets.person_icon} alt="Person" className="w-5" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-white w-full"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#1e213a] border border-[#2e324a]">
            <img src={assets.mail_icon} alt="Mail" className="w-5" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-white w-full"
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#1e213a] border border-[#2e324a]">
            <img src={assets.lock_icon} alt="Lock" className="w-5" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-white w-full"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-center text-sm text-[#00ffcc] cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          <button className="w-full py-2.5 bg-[#00ffcc] text-[#0f0f1a] font-semibold rounded-full hover:bg-[#00e6b2] transition-all">
            {state}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-[#00ffcc] cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-[#00ffcc] cursor-pointer hover:underline"
              >
                Register
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
