import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";
import axios from "axios";

import AddVendorModal from "./vendorComponent/AddVendorModal";
import EditVendorModal from "./vendorComponent/EditVendorModal";
import ViewVendorModal from "./vendorComponent/ViewVendorModal";

// API base URL from environment variables
const API_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://api.smartdhobi.in/api"

// Main Vendor Management component
const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    growthRate: {
      total: 0,
      active: 0,
      suspended: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch all vendors from API
  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/providers`);

      // Transform API data to match our UI format
      const transformedVendors = response.data.providers.map((provider) => ({
        id: provider._id,
        dhobiId: provider.dhobiId,
        name: provider.name,
        isApproved: provider.isApproved,
        owner: provider.owner, // Consider fetching user details separately if needed
        email: provider.email || "N/A",
        phone: provider.mobile || "N/A",
        address: provider.address || "N/A",
        serviceAreas: provider.serviceAreas || [],
        status: provider.isActive === true? "Active" : "Suspended",
        commissionRate: 15, // You might want to store this in your schema
        joinDate: new Date(provider.createdAt).toISOString().split("T")[0],
        ordersCompleted: provider.ordersCompleted || 0,
        rating: provider.rating || 0,
        services: parseServices(provider),
      }));

      setVendors(transformedVendors);

      // Calculate statistics
      calculateStats(transformedVendors);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to parse services from provider data
  const parseServices = (provider) => {
    if (!provider.pricing) return [];

    const services = [];
    // Convert pricing object to services array
    if (provider.pricing.shirt) {
      services.push({ name: "Shirt", price: `₹${provider.pricing.shirt}` });
    }
    if (provider.pricing.trouser) {
      services.push({ name: "Trouser", price: `₹${provider.pricing.trouser}` });
    }
    // Add more services as needed

    return services;
  };

  // Calculate statistics from vendor data
  const calculateStats = (vendorData) => {
    const total = vendorData.length;
    const active = vendorData.filter((v) => v.status === "Active").length;
    const suspended = vendorData.filter((v) => v.status === "Suspended").length;

    // Set stats
    setStats({
      total,
      active,
      suspended,
      growthRate: {
        total: 12, // These would ideally come from historical data comparison
        active: 5,
        suspended: 0,
      },
    });
  };

  // Load vendors when component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  console.log(vendors , "vendors")
  const filteredVendors = vendors.filter((vendor) => {
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      vendor.name?.toLowerCase().includes(query) ||
      vendor.id?.toLowerCase().includes(query) ||
      vendor.owner?.toLowerCase().includes(query) ||
      vendor.email?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || vendor.status === statusFilter;

    return matchesQuery && matchesStatus;
  });


  // Handler for viewing vendor details
  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  // Handler for editing vendor
  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };



  console.log("Vendors:", selectedVendor);
  // Handler for saving edited vendor
  const handleSaveVendor = async (updatedVendor) => {
    try {
      // Transform vendor data to match API format
      const vendorData = {
        name: updatedVendor.name,
        userId: updatedVendor.owner,
        email: updatedVendor.email,
        phone: updatedVendor.phone,
        address: updatedVendor.address,
        serviceAreas: updatedVendor.serviceAreas,
        isActive: updatedVendor.status === "Active" ? "true" : "false",
        pricing: {},
      };

      // Convert services to pricing object
      updatedVendor.services.forEach((service) => {
        const serviceName = service.name.toLowerCase();
        const price = parseFloat(service.price.replace(/[^0-9.]/g, ""));
        vendorData.pricing[serviceName] = price;
      });

      await axios.patch(
        `${API_BASE_URL}/providers/${updatedVendor.id}`,
        vendorData
      );

      // Update local state
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === updatedVendor.id ? updatedVendor : vendor
        )
      );

      setIsEditModalOpen(false);
      // Refresh vendor list to get latest data
      fetchVendors();
    } catch (err) {
      console.error("Error updating vendor:", err);
      alert("Failed to update vendor. Please try again.");
    }
  };

  // Handler for activating vendor
  const handleActivateVendor = async (vendorId) => {
    try {
      await axios.patch(`${API_BASE_URL}/providers/profile-active/${vendorId}`, {
        isApproved: "approved",
      });

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, status: "Active" } : vendor
        )
      );

      setIsViewModalOpen(false);
      fetchVendors(); // Refresh data
    } catch (err) {
      console.error("Error activating vendor:", err);
      alert("Failed to activate vendor. Please try again.");
    }
  };

  // Handler for suspending vendor
  const handleSuspendVendor = async (vendorId) => {
    try {
      await axios.patch(`${API_BASE_URL}/providers/${vendorId}/status`, {
        isActive: "false",
      });

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, status: "Suspended" } : vendor
        )
      );

      setIsViewModalOpen(false);
      fetchVendors(); // Refresh data
    } catch (err) {
      console.error("Error suspending vendor:", err);
      alert("Failed to suspend vendor. Please try again.");
    }
  };

  // Handler for deleting vendor
  const handleDeleteVendor = async (vendorId) => {
    try {
      await axios.delete(`${API_BASE_URL}/providers/${vendorId}`);

      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor.id !== vendorId)
      );

      setIsViewModalOpen(false);
      fetchVendors(); // Refresh data
    } catch (err) {
      console.error("Error deleting vendor:", err);
      alert("Failed to delete vendor. Please try again.");
    }
  };

  // Handler for adding new vendor
  const handleAddVendor = async (newVendor) => {
    try {
      // Initialize pricing as an empty object
      newVendor.pricing = {};

      // Convert services to pricing object
      newVendor.services.forEach((service) => {
        const serviceName = service.name.toLowerCase();
        const price = parseFloat(service.price.replace(/[^0-9.]/g, ""));
        newVendor.pricing[serviceName] = price;
      });

      const response = await axios.post(
        `${API_BASE_URL}/providers/create`,
        newVendor
      );

      // Add the new vendor to state with API-generated ID
      const createdVendor = {
        ...newVendor,
        id: response.data.provider._id,
      };

      setVendors((prevVendors) => [...prevVendors, createdVendor]);

      // Refresh vendor list to get complete data
      fetchVendors();
    } catch (err) {
      console.error("Error adding vendor:", err);
      alert("Failed to add vendor. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Dhobi Management</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card border-l-indigo-500">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Total Dhobis
          </h3>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-green-600 mt-1">
            ↑ {stats.growthRate.total}% from last month
          </p>
        </div>

        <div className="stat-card border-l-emerald-500">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Active Dhobis
          </h3>
          <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
          <p className="text-xs text-green-600 mt-1">
            ↑ {stats.growthRate.active}% from last month
          </p>
        </div>

        <div className="stat-card border-l-red-500">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Suspended Dhobis
          </h3>
          <p className="text-2xl font-bold text-gray-800">{stats.suspended}</p>
          <p className="text-xs text-gray-500 mt-1">
            No change from last month
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search Dhobis by name, ID, or owner..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block pl-3 pr-10 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                        >
                          Dhobi
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Service Areas
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Approval
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rating
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Orders
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredVendors.length > 0 ? (
                        filteredVendors.map((vendor) => (
                          <tr
                            key={vendor.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewVendor(vendor.id)}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                              <div className="flex items-center">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {vendor.dhobiId}
                                  </div>
                                 <div className="text-gray-500">
                                {vendor.owner}
                              </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="text-gray-900">
                                {vendor.name}
                              </div>
                              <div className="text-gray-500">
                                {vendor.email}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {Array.isArray(vendor.serviceAreas)
                                ? vendor.serviceAreas.slice(0, 2).join(", ") +
                                  (vendor.serviceAreas.length > 2 ? "..." : "")
                                : vendor.serviceAreas || "N/A"}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={
                                  vendor.status === "Active"
                                    ? "bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    : vendor.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    : "bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
                                }
                              >
                                {vendor.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                             {vendor.isApproved}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {vendor.rating > 0
                                ? `${vendor.rating}/5.0`
                                : "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {vendor.ordersCompleted || 0}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewVendor(vendor.id);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                View
                                <span className="sr-only">, {vendor.name}</span>
                              </button>
                              {vendor.status === "Active" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditVendor(vendor.id);
                                  }}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Edit
                                  <span className="sr-only">
                                    , {vendor.name}
                                  </span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-3 py-6 text-center text-sm text-gray-500"
                          >
                            No Dhobis found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Vendor Modal */}
      {isViewModalOpen && selectedVendor && (
        <ViewVendorModal
          vendorId={selectedVendor}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={handleEditVendor}
          onSuspend={handleSuspendVendor}
          onActivate={handleActivateVendor}
          onDelete={handleDeleteVendor}
        />
      )}

      {/* Edit Vendor Modal */}
      {isEditModalOpen && selectedVendor && (
        <EditVendorModal
          vendorId={selectedVendor}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveVendor}
        />
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={handleAddVendor}
      />
    </div>
  );
};

export default VendorManagement;
