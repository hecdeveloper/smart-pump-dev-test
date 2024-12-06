import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: token },
        });
        setUser(data);
      } catch {
        alert('Session expired. Please log in again.');
        navigate('/');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/100" // Imagen de perfil ficticia
            alt="User Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{user.name.first} {user.name.last}</h2>
          <p className="text-gray-700 mb-4">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Balance:</span>
            <span className="text-gray-800 font-bold">{user.balance}</span>
          </div>

          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
