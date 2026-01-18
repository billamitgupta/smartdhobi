import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Store,
  FileText,
  CreditCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import logo from '../../assets/logo.png';

const DealerRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    storeName: "",
    storeGstin: "",
    panCard: "",
    storeAddress: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be 10 digits";

    if (!formData.storeName) newErrors.storeName = "Store name is required";
    else if (formData.storeName.length < 3)
      newErrors.storeName = "Store name must be at least 3 characters";

    if (!formData.storeGstin) newErrors.storeGstin = "GSTIN is required";
    else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.storeGstin
      )
    )
      newErrors.storeGstin = "Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)";

    if (!formData.panCard) newErrors.panCard = "PAN card is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard))
      newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";

    if (!formData.storeAddress)
      newErrors.storeAddress = "Store address is required";
    else if (formData.storeAddress.length < 10)
      newErrors.storeAddress = "Please provide a complete address";

    if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Pin code must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "storeGstin" || name === "panCard") {
      processedValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: processedValue });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToastType("error");
      setToastMessage("Please fix all errors before submitting");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      storeName: formData.storeName,
      storeGstin: formData.storeGstin,
      panCard: formData.panCard,
      storeAddress: formData.storeAddress,
      pinCode: formData.pinCode,
      role: "dealer",
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/dealer-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setToastType("error");
        setToastMessage(data.message || "Registration failed. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        storeName: "",
        storeGstin: "",
        panCard: "",
        storeAddress: "",
        pinCode: "",
      });
      setErrors({});

      setToastType("success");
      setToastMessage(
        "Registration successful! Your account is pending approval from admin."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error("Error:", error);
      setToastType("error");
      setToastMessage("Server error! Please try again later.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-6 px-4 sm:px-6 lg:px-8">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`${
              toastType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md`}
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-lg flex-shrink-0">
              {toastType === "success" ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {toastType === "success" ? "Success!" : "Error!"}
              </p>
              <p className="text-sm opacity-90">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
      <div className="text-center mb-2">
          <div className="flex flex-col items-center">
            <img 
              src={logo}
              alt="Company Logo" 
              className="h-40 w-auto  object-contain" 
            />
            <h1 className="text-3xl font-bold text-gray-900 ">
              Dealer Registration
            </h1>
          </div>
         
          <div className="mt-1 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Your account will be activated after admin approval</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.mobile}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Re-enter your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-gray-50">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Store Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.storeName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your store name"
                />
                {errors.storeName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.storeName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store GSTIN *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="storeGstin"
                    value={formData.storeGstin}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.storeGstin ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                  />
                </div>
                {errors.storeGstin && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.storeGstin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.panCard ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>
                {errors.panCard && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.panCard}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pin Code *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                      errors.pinCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="6-digit pin code"
                    maxLength={6}
                  />
                </div>
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.pinCode}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Address *
                </label>
                <textarea
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition ${
                    errors.storeAddress ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter complete store address with landmarks"
                />
                {errors.storeAddress && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.storeAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-800 hover:bg-amber-900 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Register as Dealer"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-amber-800 hover:text-amber-900 font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By registering, you agree to our{" "}
            <a href="#" className="text-amber-800 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-amber-800 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DealerRegistrationForm;