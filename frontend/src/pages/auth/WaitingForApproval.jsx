import React from "react";
import { Clock, Mail, CheckCircle, Home, LogIn, Leaf } from "lucide-react";

function WaitingForApproval() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
 
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Icon Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-12 h-12 text-amber-800" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Account Under Review
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Thank you for registering with LEAFKAART!
          </p>

          {/* Status Message */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                  What's happening now?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Our team is carefully reviewing your registration details and
                  business information. This process typically takes 24-48 hours.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once your account is approved, you'll receive a confirmation
                  email with next steps to access your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-800 mb-4 text-center">
              Approval Timeline
            </h4>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Registration
                  <br />
                  Complete
                </span>
              </div>

              <div className="flex-1 h-1 bg-amber-300 mx-2"></div>

              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Under
                  <br />
                  Review
                </span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Email
                  <br />
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              Go to Login
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Need help?{" "}
              <a
                href="mailto:leafkaart.in@gmail.com"
                className="text-amber-700 hover:text-amber-800 font-semibold"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Please check your email regularly for updates
        </p>
      </div>
    </div>
  );
}

export default WaitingForApproval;