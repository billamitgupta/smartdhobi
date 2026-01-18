import React, { useState } from "react";
import { Eye, EyeOff, Leaf, Mail, Lock, User, Shield } from "lucide-react";
import logo from '../../assets/logo.png';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "../Toast/Toast"; // Adjust path as needed
import { useToast } from "../../hooks/useToast"; // Adjust path as needed
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice'; // Use setCredentials instead of loginSuccess
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    addToast("Please fix the errors in the form", "error");
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      formData
    );
    
    console.log("Login Success", res.data);
    
    // Store auth data in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Dispatch to Redux store
    dispatch(setCredentials({
      user: res.data.user,
      token: res.data.token
    }));
    
    // Get user role for navigation
    const userRole = res.data.user.role?.toLowerCase();
    
    // Show success toast
    addToast(`Welcome back! Login successful as ${userRole}`, "success");
    
    // Navigate based on role after a short delay to show the toast
    setTimeout(() => {
      switch(userRole) {
        case "dealer":
          navigate("/dealer/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "employee":
          navigate("/employee/dashboard");
          break;
        default:
          navigate("/admin/dashboard");
      }
    }, 1000);
    
  } catch (error) {
    console.error("Login error:", error);
    const message = error?.response?.data?.message || error.message || "Login failed. Please try again.";
    
    // Show error toast
    addToast(message, "error");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <img src={logo} alt="Logo" className="mx-auto mb-6 h-40" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="you@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Forgot Password */}
              {/* <div className="text-right">
                <button 
                  type="button" 
                  disabled={isLoading}
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div> */}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Link to Register */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-amber-700 hover:text-amber-800 font-semibold">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;