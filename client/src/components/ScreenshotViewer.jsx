import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ScreenshotViewer = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    fetchScreenshots();
  }, [userData]);

  const fetchScreenshots = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/screenshots?userId=${userData?._id}`,
        { withCredentials: true }
      );
      if (data.success) {
        setScreenshots(data.screenshots);
      }
    } catch (error) {
      toast.error("Failed to fetch screenshots");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading screenshots...</div>;
  }

  return (
    <div className="bg-[#1a1f2e] p-6 rounded-lg border border-cyan-800 shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">Screenshots</h2>

      {screenshots.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No screenshots available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot._id}
              className="cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedScreenshot(screenshot)}
            >
              <img
                src={`data:image/png;base64,${screenshot.image}`}
                alt="Screenshot"
                className="w-full h-auto rounded border border-slate-700"
              />
              <p className="text-xs text-gray-400 mt-1 truncate">
                {new Date(screenshot.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={`data:image/png;base64,${selectedScreenshot.image}`}
              alt="Screenshot"
              className="max-w-full max-h-screen"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
              {selectedScreenshot.windowTitle}
              <br />
              {new Date(selectedScreenshot.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotViewer;
