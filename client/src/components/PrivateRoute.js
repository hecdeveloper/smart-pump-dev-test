import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  // Authentication verification
  const token = localStorage.getItem("token");

  // Monitors token presence and validity
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Render protected route or redirect based on auth status
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
