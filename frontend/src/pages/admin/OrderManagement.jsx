import React, { useEffect, useState } from "react";
import {
  Search,
  Package,
  Truck,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  FileText,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { getOrderManagment } from "../../auth/ApiConnect";

const OrderManagement = () => {
  // Sample data - replace with actual API integration
  const [orders, setOrders] = useState([]);
  const [orderManagement, setOrderManagment] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrderManagment();
      if (response && response.orders) {
        setOrders(response.orders);
        setOrderManagment(response.summary);
        
      } else {
        console.error("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.providerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const resolveDispute = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, hasDispute: false } : order
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, hasDispute: false });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "accepted":
        return <span className="badge badge-primary">Accepted</span>;
      case "in_progress":
        return <span className="badge badge-info">In Progress</span>;
      case "ready":
        return <span className="badge badge-blue">Ready</span>;
      case "delivered":
        return <span className="badge badge-success">Delivered</span>;
      case "cancelled":
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge badge-success">Paid</span>;
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "refunded":
        return <span className="badge badge-info">Refunded</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pt-6">
        Order Management
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-gray-800">{orderManagement.totalOrders}</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-1">↑ 8% from last week</p>
        </div>

        <div className="stat-card border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                In Progress
              </h3>
              <p className="text-2xl font-bold text-gray-800">{orderManagement.pendingOrders}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            14 pickups scheduled today
          </p>
        </div>

        <div className="stat-card border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Completed
              </h3>
              <p className="text-2xl font-bold text-gray-800">{orderManagement.completedOrders}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
        </div>

        <div className="stat-card border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Disputes
              </h3>
              <p className="text-2xl font-bold text-gray-800">{orderManagement.disputeOrders}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-1">↑ 2 new disputes today</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search order ID, customer, vendor..."
              className=" p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex  items-center gap-2">
            <select
              className="form-input bg-white py-5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select className="form-input bg-white py-2">
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>

            <button className="btn btn-primary flex items-center gap-1">
              <FileText className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Order ID</th>
                <th className="table-header-cell">Customer</th>
                <th className="table-header-cell">Dhobi</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Date</th>
                {/* <th className="table-header-cell">Actions</th> */}
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="table-row">
                    <td className="table-cell font-medium">
                      <div className="flex items-center">
                        {order.orderId}
                        {order.hasDispute && (
                          <span className="ml-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {order.customer}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.userPhone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {order.dhobi}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.amount}
                      </div>
                      <div className="text-xs">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-500">
                        Created:
                        <br />
                        {formatDate(order.date)}
                      </div>
                    </td>
                    {/* <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            {order.status !== "completed" &&
                              order.status !== "cancelled" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(order.id, "completed")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Mark as Completed
                                </button>
                              )}
                            {order.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, "cancelled")
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Cancel Order
                              </button>
                            )}
                            {order.hasDispute && (
                              <button
                                onClick={() => resolveDispute(order.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Resolve Dispute
                              </button>
                            )}
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Print Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No orders found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredOrders.length}</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-outline py-1 px-3">Previous</button>
            <button className="btn btn-primary py-1 px-3">Next</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.id}
                </h3>
                {selectedOrder.hasDispute && (
                  <span className="badge badge-danger flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Dispute
                  </span>
                )}
              </div>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 max-h-screen overflow-y-auto">
              {/* Status and Key Info */}
              <div className="flex flex-wrap justify-between mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Payment</p>
                  <div className="mt-1 flex items-center space-x-2">
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    <span className="text-gray-700 text-sm capitalize">
                      ({selectedOrder.paymentMethod})
                    </span>
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">₹{selectedOrder.total}</p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Info */}
                <div className="card">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.userPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Vendor & Scheduling Info */}
                <div className="card">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Vendor & Schedule
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="font-medium">{selectedOrder.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.pickupDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Delivery</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.deliveryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items
                </h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Unit Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan="3"
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                        >
                          Total Amount:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{selectedOrder.total}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions for this order */}
              {selectedOrder.hasDispute && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Dispute Information
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Customer reported issues with the service. Please
                          contact the customer or vendor to resolve this issue.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => resolveDispute(selectedOrder.id)}
                          className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 text-sm py-2"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Order Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status !== "completed" &&
                    selectedOrder.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrder.id, "completed")
                        }
                        className="btn btn-success bg-green-600 text-white hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </button>
                    )}

                  {selectedOrder.status !== "cancelled" && (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedOrder.id, "cancelled")
                      }
                      className="btn btn-danger flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Order
                    </button>
                  )}

                  <button className="btn btn-outline flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button onClick={closeDetailModal} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
