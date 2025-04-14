import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const KeyloggerSettings = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [settings, setSettings] = useState({
    captureScreenshots: false,
    screenshotInterval: 60,
    encryptData: true,
    maxKeystrokeBuffer: 300,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.keyloggerSettings) {
      setSettings(userData.keyloggerSettings);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/keylogger-settings`,
        { settings },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Settings saved successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1f2e] p-6 rounded-lg border border-cyan-800 shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">
        Keylogger Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Capture Screenshots</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="captureScreenshots"
              checked={settings.captureScreenshots}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        {settings.captureScreenshots && (
          <div>
            <label className="text-sm font-medium block mb-2">
              Screenshot Interval (minutes)
            </label>
            <input
              type="number"
              name="screenshotInterval"
              value={settings.screenshotInterval}
              onChange={handleChange}
              min="1"
              max="240"
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2 w-full"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Encrypt Data</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="encryptData"
              checked={settings.encryptData}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            Max Keystroke Buffer (characters)
          </label>
          <input
            type="number"
            name="maxKeystrokeBuffer"
            value={settings.maxKeystrokeBuffer}
            onChange={handleChange}
            min="100"
            max="1000"
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default KeyloggerSettings;
