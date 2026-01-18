import React, { useState, useEffect } from "react";
import { Leaf, Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { useVerifyOtpMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const OtpLogin = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [counter, setCounter] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const validatePhone = () => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return null;
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    let timer;
    if (step === 2 && counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, counter]);

  const handleSendOtp = () => {
    const error = validatePhone();
    if (error) {
      setErrors({ phone: error });
      return;
    }
    setErrors({});
    setStep(2);
    setCounter(30);
    setCanResend(false);
    console.log("OTP sent to:", phone);
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      return toast.error("Please enter the full 6-digit OTP.");
    }

    try {
      const res = await verifyOtp({ userId, otp: fullOtp }).unwrap();

      toast.success("OTP Verified Successfully!", { autoClose: 1200 });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setCounter(30);
    setCanResend(false);
    console.log("OTP resent to:", phone);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-amber-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-40 right-10 w-60 h-60 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border-4 border-white rounded-full" />
        </div>

        {/* Logo & Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LEAFKAART</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Quick & Secure
            <br />
            OTP Login
          </h1>
          <p className="text-amber-100 text-lg max-w-md">
            No password needed. Just enter your phone number and verify with
            OTP.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          {[
            "Instant OTP delivery",
            "Secure verification",
            "No password required",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-800 rounded-xl mb-3">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">LEAFKAART</h1>
          </div>

          {/* Step 1: Enter Phone */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-amber-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  OTP Login
                </h2>
                <p className="text-gray-500">
                  Enter your phone number to receive OTP
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full pl-14 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition ${
                      errors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-100 bg-gray-50 focus:bg-white"
                    }`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-xl font-medium transition"
              >
                Send OTP
              </button>

              <p className="text-center text-sm text-gray-500">
                Back to{" "}
                <a
                  href="/login"
                  className="text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Change number
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-amber-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-500">
                  Enter the 6-digit code sent to
                  <br />
                  <span className="font-semibold text-gray-800">
                    +91 {phone}
                  </span>
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-amber-500 focus:bg-white focus:outline-none transition"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center text-sm">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-amber-700 font-semibold hover:text-amber-800"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend OTP in{" "}
                    <span className="font-semibold text-amber-700">
                      {counter}s
                    </span>
                  </span>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Back to{" "}
                <a
                  href="/login"
                  className="text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;
