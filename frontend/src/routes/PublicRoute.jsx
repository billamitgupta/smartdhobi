
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      admin: '/admin/dashboard',
      employee: '/employee/dashboard',
      dealer: '/dealer/dashboard',
      customer: '/customer/home',
    };
    
    return <Navigate to={roleRedirects[user.role] || '/customer/home'} replace />;
  }

  return children;
};

export default PublicRoute;
