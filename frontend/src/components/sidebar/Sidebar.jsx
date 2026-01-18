import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import leaflogo from "../../assets/favicon.ico"
import logo from '../../assets/logo.png';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  User,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Building2,
  ArrowRightCircle,
  Leaf
} from "lucide-react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(["products"]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role?.toLowerCase() || "dealer";

  const currentDealer = JSON.parse(localStorage.getItem("currentDealer") || "null");
  const isDealerMode = !!currentDealer;

  // Define all menu items with roles and dynamic paths
  const allMenuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      getRolePath: (role) => `/${role}/dashboard`,
      roles: ["admin", "employee", "dealer"] 
    },
    { 
      id: "categories", 
      label: "Categories", 
      icon: LayoutDashboard, 
      getRolePath: (role) => `/${role}/categories`,
      roles: ["admin", "employee"] 
    },
    { 
      id: "products", 
      label: "Products", 
      icon: Package, 
      getRolePath: (role) => `/${role}/products`,
      roles: ["admin", "employee", "dealer"] 
    },
    { 
      id: "dealers", 
      label: "Dealers", 
      icon: Users, 
      getRolePath: (role) => `/${role}/dealers`,
      roles: ["admin", "employee"] 
    },
    { 
      id: "employees", 
      label: "Employees", 
      icon: UserCheck, 
      getRolePath: () => "/admin/employees",
      roles: ["admin"] 
    },
    { 
      id: "customers", 
      label: "Customers", 
      icon: User, 
      getRolePath: (role) => `/${role}/customers`,
      roles: ["admin", "employee"] 
    },
    { 
      id: "Banner", 
      label: "Banner", 
      icon: User, 
      getRolePath: (role) => `/${role}/banners`,
      roles: ["admin"] 
    },
    { 
      id: "Orders", 
      label: "Orders", 
      icon: User, 
      getRolePath: (role) => `/${role}/orders`,
      roles: ["admin","employee"] 
    },
  ];

  // Filter menu items based on user role and generate paths
  const menuItems = useMemo(() => {
    return allMenuItems
      .filter(item => item.roles.includes(userRole))
      .map(item => ({
        ...item,
        path: item.getRolePath(userRole)
      }));
  }, [userRole]);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isPathActive = (path) => location.pathname === path;

  const isSubmenuActive = (submenu) =>
    submenu.some((item) => location.pathname === item.path);

  // Get role display text
  const getRoleDisplayText = (role) => {
    const roleMap = {
      admin: "Admin",
      employee: "Employee",
      dealer: "Dealer"
    };
    return roleMap[role] || role;
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-lg"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-52 fixed lg:sticky top-0 h-screen z-50 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="py-2 border-b border-amber-100 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <img src={logo} alt="LeafKaart Logo" className="h-14 w-20" />
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-amber-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu;
            const isActive =
              isPathActive(item.path) ||
              (item.submenu && isSubmenuActive(item.submenu));
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() =>
                    hasSubmenu ? toggleSubmenu(item.id) : handleNavigation(item.path)
                  }
                  className={`w-full flex items-center justify-between py-3 px-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-amber-800 text-white"
                        : "text-gray-700 hover:bg-amber-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>

                  {hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavigation(sub.path)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all
                          ${
                            isPathActive(sub.path)
                              ? "bg-amber-100 border-l-2 border-amber-800 text-gray-900 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 bg-white mt-auto">
          {isDealerMode ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {currentDealer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentDealer.role.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("currentDealer");
                  navigate("/admin/dealers");
                  window.location.reload();
                }}
                className="w-full py-2 bg-amber-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-amber-900 transition-all text-sm"
              >
                <ArrowRightCircle className="w-4 h-4 rotate-180" />
                Back to Admin
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3" onClick={()=>navigate("/admin/profile")}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {user?.name || "User"}
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    {user?.email || "leafkaart.in@gmail.com"}
                  </p> */}
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    {getRoleDisplayText(userRole)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;