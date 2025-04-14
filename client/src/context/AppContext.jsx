import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Global App Context
export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check Auth Status
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });

      if (data.success && data.user) {
        setIsLoggedin(true);
        setUserData(data.user);
        console.log("User data loaded:", data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  // Get User Data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
        console.log(
          "%c[✓] User Data Loaded",
          "color: limegreen; font-weight: bold;"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
      console.error(
        "%c[✗] Failed to fetch user data:",
        "color: orange; font-weight: bold;",
        error
      );
    }
  };

  // Load auth state on mount
  useEffect(() => {
    getAuthState();
  }, []);

  // Global context values
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
