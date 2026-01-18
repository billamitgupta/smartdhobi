import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProtectedRoute from "./ProtectedRoute";
import OtpLogin from "../pages/auth/OtpLogin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AdminDashboard from "../pages/admin/Dashboard";
import MainLayout from "../layouts/MainLayout";
import DealersList from "../pages/admin/DealersList";
import DealerDashboard from "../pages/dealer/DealerDashboard";
import CustomerDashboard from "../pages/employee/CustomerDashboard";
import ProductList from "../pages/products/ProductList";
import CategoryManagement from "../pages/Categories/CategoryManagement";
import EmployeeList from "../pages/admin/EmployeeList";
import CustomersList from "../pages/admin/CustomerList";
import UserRegister from "../pages/admin/UsersRegister";
import DealerRegistrationForm from "../pages/auth/DealerRegistrationForm";
import ProductDetail from "../pages/products/ProductDetail";
import LandingPage from "./LandingPage"; // Import your landing page
import { useSelector } from "react-redux";
import ProfilePage from "../pages/admin/ProfilePage";
import WaitingForApproval from "../pages/auth/WaitingForApproval";
import BannerManagement from "../pages/banner/BannerManagement ";
import OrderList from "../pages/orders/OrderList";
import OrderDetails from "../pages/orders/OrderDetails";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

// Simple Suspense wrapper
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

// Role-based redirect component - redirects logged in users to their dashboard
const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  // If not logged in, show landing page
  if (!user) {
    return <LandingPage />;
  }

  // If logged in, redirect based on role
  switch (user.role?.toLowerCase()) {
    case "dealer":
      return <Navigate to="/dealer/dashboard" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "employee":
      return <Navigate to="/employee/dashboard" replace />;
    default:
      return <Navigate to="/admin/dashboard" replace />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleBasedRedirect />,
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <SuspenseWrapper>
        <Register />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/dealer-register",
    element: (
      <SuspenseWrapper>
        <DealerRegistrationForm />
      </SuspenseWrapper>
    ),
  },
  {
  path: "/waiting-for-approval",
    element: (
      <SuspenseWrapper>
       <WaitingForApproval/>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/verify-otp/:userId",
    element: (
      <SuspenseWrapper>
        <OtpLogin />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <SuspenseWrapper>
        <ForgotPassword />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <SuspenseWrapper>
        <ResetPassword />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <AdminDashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <SuspenseWrapper>
            <CategoryManagement />
          </SuspenseWrapper>
        ),
      },
      {
        path: "dealers",
        element: (
          <SuspenseWrapper>
            <DealersList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <ProductList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/:productId",
        element: (
          <SuspenseWrapper>
            <ProductDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "employees",
        element: (
          <SuspenseWrapper>
            <EmployeeList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "customers",
        element: (
          <SuspenseWrapper>
            <CustomersList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "user-register",
        element: (
          <SuspenseWrapper>
            <UserRegister />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path:"banners",
        element: (
          <SuspenseWrapper>
           <BannerManagement/>
          </SuspenseWrapper>
        ),
      },
      {
        path:"orders",
        element: (
          <SuspenseWrapper>
           <OrderList/>
          </SuspenseWrapper>
        ),
      },
      {
        path:"orders/:orderId",
        element: (
          <SuspenseWrapper>
           <OrderDetails/>
          </SuspenseWrapper>
        ),
      }
    ],
  },
  {
    path: "/dealer",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <DealerDashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/:productId",
        element: (
          <SuspenseWrapper>
            <ProductDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <ProductList />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <CustomerDashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/:productId",
        element: (
          <SuspenseWrapper>
            <ProductDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <ProductList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "customers",
        element: (
          <SuspenseWrapper>
            <CustomersList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <SuspenseWrapper>
            <CategoryManagement />
          </SuspenseWrapper>
        ),
      },
      {
        path: "dealers",
        element: (
          <SuspenseWrapper>
            <DealersList />
          </SuspenseWrapper>
        ),
      },
      {
        path:"orders",
        element: (
          <SuspenseWrapper>
           <OrderList/>
          </SuspenseWrapper>
        ),
      }
    ],
  },
  {
    path: "*",
    element: <RoleBasedRedirect />,
  },
]);

export default router;
