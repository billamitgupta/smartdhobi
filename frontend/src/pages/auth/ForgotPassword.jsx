import React, { useState } from "react";
import { Leaf, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateEmail();
    if (error) {
      setErrors({ email: error });
      return;
    }

    setErrors({});
    setSuccess(true);

    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">LEAF Platform</h1>
          <p className="text-gray-600 mt-2">E-commerce Multi-Portal System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Forgot Password
          </h2>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">
                A password reset link has been sent to:
              </p>
              <p className="font-semibold text-gray-800">{email}</p>

              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-green-600 font-semibold hover:text-green-700"
              >
                Enter a different email
              </button>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center text-sm">
            Back to{" "}
            <a
              href="/login"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
