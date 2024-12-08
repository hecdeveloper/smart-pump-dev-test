import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data with authentication checks
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Security: Early token validation to prevent unnecessary API calls
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch user data with authentication
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.error || "Failed to load profile");

        // Handle authentication failures by clearing session and redirecting
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Secure logout handler: Clears all session data before redirecting
  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Loading state handler with error display
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        {/* Authentication controls */}
        <div className="flex justify-end p-4 bg-gray-50">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* User profile image section */}
        <div className="flex items-center justify-center p-6 bg-blue-500">
          <img
            src={user.picture || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 border-4 border-white rounded-full"
          />
        </div>

        {/* User information display */}
        <div className="p-6">
          {/* Basic user details */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">
              {user.name.first} {user.name.last}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* User status and personal information grid */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            {/* Account status card */}
            <div className="p-4 rounded-lg bg-blue-50">
              <h3 className="mb-2 font-semibold text-blue-800">
                Account Status
              </h3>
              <p className="text-gray-700">
                Balance: <span className="font-bold">{user.balance}</span>
              </p>
              <p className="text-gray-700">
                Status:{" "}
                <span className="font-bold">
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            {/* Personal information card */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-semibold text-gray-800">
                Personal Info
              </h3>
              <p className="text-gray-700">
                Age: <span className="font-bold">{user.age}</span>
              </p>
              <p className="text-gray-700">
                Eye Color: <span className="font-bold">{user.eyeColor}</span>
              </p>
            </div>
          </div>

          {/* Extended user information and actions */}
          <div className="space-y-4">
            {/* Contact information section */}
            <div className="pt-4 border-t">
              <h3 className="mb-2 font-semibold text-gray-800">
                Contact Information
              </h3>
              <p className="text-gray-700">
                Company: <span className="font-bold">{user.company}</span>
              </p>
              <p className="text-gray-700">
                Phone: <span className="font-bold">{user.phone}</span>
              </p>
              <p className="text-gray-700">
                Address: <span className="font-bold">{user.address}</span>
              </p>
            </div>

            {/* Profile management actions */}
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
