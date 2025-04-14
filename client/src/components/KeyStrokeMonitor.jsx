import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const KeystrokeMonitor = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [keystrokes, setKeystrokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userData?.role === "admin") {
      fetchAllKeystrokes();
      fetchUsers(); // Fetch all users if admin
    } else {
      fetchUserKeystrokes();
    }
  }, [userData]);

  const fetchAllKeystrokes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/keylogger/data`, {
        withCredentials: true,
      });
      if (data.success) {
        setKeystrokes(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserKeystrokes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/keylogger/data?userId=${userData?._id}`,
        { withCredentials: true }
      );
      if (data.success) {
        setKeystrokes(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users`, {
        withCredentials: true,
      });
      if (data.success) {
        setUsers(data.data); // Assuming this returns a list of users
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const decryptKeystrokes = (encryptedText) => {
    try {
      // In a real app, implement actual decryption logic here
      return encryptedText; // Placeholder
    } catch (error) {
      console.error("Decryption failed:", error);
      return "Unable to decrypt";
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    // Fetch keystrokes for the selected user
    if (userId) {
      setLoading(true);
      axios
        .get(`${backendUrl}/api/keylogger/data?userId=${userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setKeystrokes(response.data.data);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Failed to fetch data");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      fetchAllKeystrokes();
    }
  };

  return (
    <div className="bg-[#0f172a] p-6 rounded-lg shadow-lg border border-cyan-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Keystroke Monitor
      </h2>

      {userData?.role === "admin" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by User
          </label>
          <select
            className="bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 w-full"
            onChange={handleUserChange}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Window Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Keystrokes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Anomalies
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-700">
              {keystrokes.map((entry) => (
                <tr key={entry._id} className="hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {entry.windowTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {decryptKeystrokes(entry.keystrokes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.flags?.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-100 mr-1"
                      >
                        {flag}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.anomalies?.map((anomaly) => (
                      <span
                        key={anomaly}
                        className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-100 mr-1"
                      >
                        {anomaly}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KeystrokeMonitor;
