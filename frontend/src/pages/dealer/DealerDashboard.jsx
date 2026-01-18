// ==========================================
// FILE 1: src/components/DealerDashboard.jsx
// ==========================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Phone, ShoppingCart, TrendingUp, Package, Users, Plus, ArrowRightCircle } from 'lucide-react';

const DealerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDealer = location.state?.dealer;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700";
      case "employee": return "bg-blue-100 text-blue-700";
      default: return "bg-green-100 text-green-700";
    }
  };

  const handleBackToList = () => {
    localStorage.removeItem('currentDealer');
    navigate('/admin/dealers');
  };

  if (!currentDealer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No dealer selected</p>
          <button onClick={() => navigate('/admin/dealers')} className="text-green-600 hover:underline">
            Go back to dealers list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBackToList} className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
                <ArrowRightCircle className="w-5 h-5 rotate-180" />
                Back to List
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-green-600" />
                  {currentDealer.name}
                </h1>
                <p className="text-sm text-gray-500">Welcome, {currentDealer.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">{currentDealer.email}</p>
                <p className="text-sm text-gray-500">{currentDealer.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(currentDealer.role)}`}>
                {currentDealer.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">124</p>
                <p className="text-green-600 text-sm mt-1">+12% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">₹2.4L</p>
                <p className="text-green-600 text-sm mt-1">+8% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Products</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">89</p>
                <p className="text-gray-500 text-sm mt-1">Active inventory</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Customers</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">342</p>
                <p className="text-green-600 text-sm mt-1">+24 new this week</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[
                { id: "ORD-1234", customer: "John Doe", amount: "₹4,500", status: "Delivered", time: "2 hours ago" },
                { id: "ORD-1235", customer: "Jane Smith", amount: "₹3,200", status: "Processing", time: "5 hours ago" },
                { id: "ORD-1236", customer: "Mike Johnson", amount: "₹6,800", status: "Shipped", time: "1 day ago" },
                { id: "ORD-1237", customer: "Sarah Williams", amount: "₹2,100", status: "Delivered", time: "2 days ago" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.amount}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Product</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all">
                <Package className="w-5 h-5" />
                <span className="font-medium">Manage Inventory</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all">
                <Users className="w-5 h-5" />
                <span className="font-medium">View Customers</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Sales Report</span>
              </button>
            </div>

            {/* Dealer Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {currentDealer.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {currentDealer.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  {currentDealer.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;