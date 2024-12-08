import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Initialize form with current user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Populate form fields with existing user data
      setValue("name.first", user.name.first);
      setValue("name.last", user.name.last);
      setValue("phone", user.phone);
      setValue("address", user.address);
      setValue("age", user.age);
      setValue("eyeColor", user.eyeColor);
    }
  }, [setValue]);

  // Handle form submission and profile update
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile`,
        {
          firstName: data.name.first,
          lastName: data.name.last,
          phone: data.phone,
          address: data.address,
          age: parseInt(data.age),
          eyeColor: data.eyeColor,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/profile");
    } catch (error) {
      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(error.response?.data?.error || "Error updating profile");
      }
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        {/* Profile update form with validation */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First name input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("name.first", {
                  required: "First name is required",
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name?.first && (
                <span className="text-sm text-red-500">
                  {errors.name.first.message}
                </span>
              )}
            </div>

            {/* Last name input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("name.last", {
                  required: "Last name is required",
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name?.last && (
                <span className="text-sm text-red-500">
                  {errors.name.last.message}
                </span>
              )}
            </div>
          </div>

          {/* Contact information */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone", { required: "Phone is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address", { required: "Address is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <span className="text-sm text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Personal information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 18, message: "Must be at least 18" },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.age && (
                <span className="text-sm text-red-500">
                  {errors.age.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Eye Color
              </label>
              <input
                {...register("eyeColor", { required: "Eye color is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.eyeColor && (
                <span className="text-sm text-red-500">
                  {errors.eyeColor.message}
                </span>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 py-3 font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
