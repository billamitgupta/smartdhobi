import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Layout Components
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import DhobiLayout from "./layouts/DhobiLayout";

// Auth Pages
import Login from "./pages/auth/Login";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import VendorManagement from "./pages/admin/VendorManagement";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import RevenuePayments from "./pages/admin/RevenuePayments";
import Reports from "./pages/admin/Reports";
import LandryServiceApp from "./pages/landingPage/LandryServiceApp";

// Dashboards
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import DhobiDashboard from "./pages/dashboards/DhobiDashboard";
import DhobiRegistration from "./pages/landingPage/auth/DhobiRegistration";
import DhobiBookingService from "./pages/customer/DhobiBookingService";
import OrdersDisplay from "./pages/order/OrdersDisplay";
import OrderDetailsModal from "./pages/dhobi/OrderDetailsModal";
import DhobiOrderDisplay from "./pages/dhobi/DhobiOrderDisplay";
import DhobiServices from "./pages/dhobi/DhobiServices";
import TermsAndConditions from "./pages/about/TermsAndConditions";
import AboutUs from "./pages/about/AboutUs";
import PrivacyPolicy from "./pages/about/PrivacyPolicy";

// Verification Pending Component
const DhobiVerificationPending = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-10 w-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Account Under Review
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Your dhobi registration has been submitted successfully. Our team
            will review your application and get back to you within 24-48 hours.
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Our team will verify your documents</li>
              <li>We'll check your service area availability</li>
              <li>You'll receive an email once approved</li>
            </ul>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Unauthorized Access Component
const UnauthorizedAccess = () => {
  const userRole = localStorage.getItem("role");
  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "dhobi":
        return "/dhobi";
      case "user":
      case "customer":
        return "/customer";
      default:
        return "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            You don't have permission to access this page. You will be
            redirected to your dashboard.
          </p>
          <button
            onClick={() => (window.location.href = getDashboardPath())}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Auth Guard - Checks if user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role Guard - Checks if user has the required role
const RoleGuard = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  if (!allowedRoles.includes(userRole)) {
    return <UnauthorizedAccess />;
  }

  return children;
};

// Dhobi Verification Guard
const DhobiVerificationGuard = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const verified = user.isVerified;

      // Check if user exists and has verification status
      if (Object.keys(user).length === 0) {
        // No user data, redirect to login
        setIsVerified(false);
      } else {
        setIsVerified(verified === true);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Show loading while checking verification status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not verified, show pending verification page
  if (isVerified === false) {
    return <DhobiVerificationPending />;
  }

  // If verified, show the protected content
  return children;
};

// Layout Components with Role Protection
const AdminRoutes = () => (
  <RoleGuard allowedRoles={["admin"]}>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </RoleGuard>
);

const DhobiRoutes = () => (
  <RoleGuard allowedRoles={["dhobi"]}>
    <DhobiVerificationGuard>
      <DhobiLayout>
        <Outlet />
      </DhobiLayout>
    </DhobiVerificationGuard>
  </RoleGuard>
);

const UserRoutes = () => (
  <RoleGuard allowedRoles={["user", "customer"]}>
    <CustomerLayout>
      <Outlet />
    </CustomerLayout>
  </RoleGuard>
);

const AppRouter = () => {
  // Redirect to dashboard based on role
  const getDashboardPath = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) return "/login";

    // If token exists, redirect based on role
    switch (role) {
      case "admin":
        return "/admin";
      case "dhobi":
        return "/dhobi";
      case "user":
      case "customer":
        return "/customer";
      default:
        return "/login";
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/dhobi-register" element={<DhobiRegistration />} />
        <Route path="/" element={<LandryServiceApp />} />

        {/* Admin Routes - Only accessible by admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="revenue" element={<RevenuePayments />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Dhobi Routes - Only accessible by dhobi role with verification */}
        <Route
          path="/dhobi"
          element={
            <ProtectedRoute>
              <DhobiRoutes />
            </ProtectedRoute>
          }
        >
          <Route index element={<DhobiDashboard />} />
          <Route path="orders" element={<DhobiOrderDisplay />} />
          <Route path="orders/:orderId" element={<OrderDetailsModal />} />
          <Route path="services" element={<DhobiServices />} />
          {/* Add more dhobi-specific routes here */}
        </Route>

        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <UserRoutes />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route
            path="book-service/:dhobiId"
            element={<DhobiBookingService />}
          />
          <Route path="orders" element={<OrdersDisplay />} />
          {/* Add more user-specific routes here */}
        </Route>

        {/* Fallback route - Redirects to appropriate dashboard */}
        <Route
          path="*"
          element={<Navigate to={getDashboardPath()} replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
