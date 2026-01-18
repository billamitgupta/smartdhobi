import { useState } from "react";
import {
  useGetOrdersQuery,
  useGetOrderQuery,
} from "../../store/api/ordersApi";
import {
  ChevronDown,
  Filter,
  Package,
  Search,
  Eye,
  Calendar,
  DollarSign,
  User,
  MapPin,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderList() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDealer = user?.role === "dealer";
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetOrdersQuery();

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search === "" ||
      order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "order_placed", label: "Order Placed" },
    { value: "processing", label: "Processing" },
    { value: "packed", label: "Packed" },
    { value: "ready_for_dispatch", label: "Ready for Dispatch" },
    { value: "shipped", label: "Shipped" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      order_placed: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      packed: "bg-purple-100 text-purple-700",
      ready_for_dispatch: "bg-indigo-100 text-indigo-700",
      shipped: "bg-cyan-100 text-cyan-700",
      out_for_delivery: "bg-orange-100 text-orange-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      returned: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatStatus = (status) => {
    return status
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleViewOrder = (orderId) => {
    navigate(`${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-2">
        {/* Title Bar with Search and Filter */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-800">Order List</h2>

          <div className="flex items-center gap-3 flex-1 justify-end flex-wrap">
            {/* Search */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Count */}
        {ordersLoading ? (
          <p className="text-sm text-gray-500 mb-4">Loading orders...</p>
        ) : ordersError ? (
          <p className="text-sm text-red-500 mb-4">Error loading orders</p>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            {filteredOrders.length} orders found
          </p>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Order Number
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Customer
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Date
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Items
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Payment
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td colSpan="8" className="py-4 px-4">
                        <div className="animate-pulse flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id || order.id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-amber-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {order.orderNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            {order?.user?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order?.user?.email || ""}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>

                      {/* Items Count */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{order.grandTotal?.toFixed(2)}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            order.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order._id || order.id)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderList;