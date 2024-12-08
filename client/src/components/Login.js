import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Handles form submission and authentication
  const onSubmit = async (data) => {
    try {
      setError("");
      // Authenticate user and receive session token
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        data
      );

      // Store authentication data securely
      localStorage.setItem("token", `Bearer ${response.data.token}`);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Brand logo display */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Smart Pump Logo" className="h-16" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>

        {/* Error message display */}
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* Login form with validation */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
