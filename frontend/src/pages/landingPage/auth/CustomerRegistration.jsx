import React, { useState } from "react";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Map,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetLocation from "../../../auth/getLocation";
import { registerUser } from "../../../auth/ApiConnect";


function CustomerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
    location: "Current location",
    serviceAreas: "",
    role: "user",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { getGeolocation, isLoadingLocation, locationStatus } = useGetLocation(
    setFormData,
    setErrors
  );

  console.log(formData, "formdata");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Simulate API call
      const response = await registerUser(formData);
      console.log("Customer registration data:", response);
      alert("Registration successful! Welcome to Smart Dhobi!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
            </div>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          {errors.mobile && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="text-gray-400 hover:text-purple-500 w-5 h-5 transition-colors duration-200" />
              ) : (
                <Eye className="text-gray-400 hover:text-purple-500 w-5 h-5 transition-colors duration-200" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <EyeOff className="text-gray-400 hover:text-purple-500 w-5 h-5 transition-colors duration-200" />
              ) : (
                <Eye className="text-gray-400 hover:text-purple-500 w-5 h-5 transition-colors duration-200" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Address / Service Area
          </label>
          <div className="flex  items-center ">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-200" />
              </div>
              <input
                type="text"
                name="serviceAreas"
                value={formData.serviceAreas}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-purple-300"
                placeholder="Enter your address"
              />
            </div>
            {errors.serviceAreas && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.serviceAreas}
              </p>
            )}
            <button
              type="button"
              onClick={getGeolocation}
              disabled={isLoadingLocation}
              className="ml-2 p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center"
            >
              {isLoadingLocation ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <MapPin size={20} />
              )}
            </button>
          </div>
          {locationStatus && (
            <p className="mt-2 text-sm text-gray-600 flex items-center">
              {locationStatus.includes("success") ? (
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
              )}
              {locationStatus}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Register
              <CheckCircle className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
export default CustomerRegistration;
