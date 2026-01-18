import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch(user.role?.toLowerCase()) {
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

export default RoleBasedRedirect;