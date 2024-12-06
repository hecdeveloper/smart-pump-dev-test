import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: responseData } = await axios.post(
        "http://localhost:5000/api/login",
        data
      );
      localStorage.setItem("token", responseData.token);
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Smart Pump Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 py-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 py-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              {...register("password", { rquired: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {/* submit btn */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
