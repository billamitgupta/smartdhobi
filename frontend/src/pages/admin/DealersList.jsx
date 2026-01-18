import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  ArrowRightCircle,
  Building2,
  Plus,
  X,
  Shield,
  CheckCircle,
  MapPin,
  Store,
  FileText,
  CreditCard,
  Lock,
  Unlock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DealersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dealers, setDealers] = useState([]);
  const [loadingDealerId, setLoadingDealerId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    storeName: "",
    storeGstin: "",
    panCard: "",
    storeAddress: "",
    pinCode: "",
    role: "dealer",
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: "dealer", label: "Dealer", icon: Building2 },
  ];

  const filtered = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      (d.storeName && d.storeName.toLowerCase().includes(search.toLowerCase()))
  );

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.name) newErrors.name = "Name is required";
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be 10 digits";
    
    if (!formData.storeName) newErrors.storeName = "Store name is required";
    
    if (!formData.storeGstin) newErrors.storeGstin = "GSTIN is required";
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.storeGstin))
      newErrors.storeGstin = "Invalid GSTIN format";
    
    if (!formData.panCard) newErrors.panCard = "PAN card is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard))
      newErrors.panCard = "Invalid PAN format";
    
    if (!formData.storeAddress) newErrors.storeAddress = "Store address is required";
    
    if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Pin code must be 6 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert to uppercase for specific fields
    if (name === "storeGstin" || name === "panCard") {
      processedValue = value.toUpperCase();
    }
    
    setFormData({ ...formData, [name]: processedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      storeName: formData.storeName,
      storeGstin: formData.storeGstin,
      panCard: formData.panCard,
      storeAddress: formData.storeAddress,
      pinCode: formData.pinCode,
      role: formData.role,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/dealer-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // Refresh dealers list
      fetchDealers();
      
      setToastMessage("Dealer added successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Server Error!");
    }
  };

  const toggleAccountStatus = async (dealer) => {
    setLoadingDealerId(dealer._id);
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/updateDealer/${dealer._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            accountStatus: !dealer.accountStatus 
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      // Update local state
      setDealers(dealers.map(d => 
        d._id === dealer._id 
          ? { ...d, accountStatus: !dealer.accountStatus }
          : d
      ));

      setToastMessage(
        dealer.accountStatus 
          ? "Account deactivated successfully!" 
          : "Account activated successfully!"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Server Error!");
    } finally {
      setLoadingDealerId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "employee":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      mobile: "",
      storeName: "",
      storeGstin: "",
      panCard: "",
      storeAddress: "",
      pinCode: "",
      role: "dealer",
    });
    setErrors({});
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/getAllDealers`,
        { method: "GET" }
      );

      const data = await res.json();

      console.log(data, "resresres");
      if (!res.ok) {
        alert(data.message || "Failed to fetch dealers");
        return;
      }

      setDealers(data.data);
    } catch (error) {
      console.error("Fetch Dealers Error:", error);
      alert("Server Error!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-amber-800 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-amber-100">
                {toastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dealers List</h1>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dealers..."
              className="w-72 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Dealer
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} dealers found
      </p>

      {/* Dealers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                Dealer Name
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                Store Name
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                Email
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                Contact
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                Role
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
            {filtered.map((dealer) => (
              <tr
                key={dealer._id}
                className="border-t border-gray-50 hover:bg-gray-50 transition"
              >
                {/* Dealer Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {dealer.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Store Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Store className="w-4 h-4 text-gray-400" />
                    {dealer.storeName || "N/A"}
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" /> {dealer.email}
                  </div>
                </td>

                {/* Mobile */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" /> {dealer.mobile}
                  </div>
                </td>

                {/* Role Badge */}
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      dealer.role
                    )}`}
                  >
                    {dealer.role.toUpperCase()}
                  </span>
                </td>

                {/* Account Status */}
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dealer.accountStatus
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dealer.accountStatus ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleAccountStatus(dealer)}
                      disabled={loadingDealerId === dealer._id}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        dealer.accountStatus
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } ${
                        loadingDealerId === dealer._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        dealer.accountStatus
                          ? "Deactivate Account"
                          : "Activate Account"
                      }
                    >
                      {loadingDealerId === dealer._id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : dealer.accountStatus ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500">
                  No dealers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800">Add New Dealer</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, role: r.value })
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.role === r.value
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.mobile ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="10-digit number"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Information Section */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Store Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.storeName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter store name"
                    />
                    {errors.storeName && (
                      <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>
                    )}
                  </div>

                  {/* GSTIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store GSTIN *
                    </label>
                    <input
                      type="text"
                      name="storeGstin"
                      value={formData.storeGstin}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.storeGstin ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                    />
                    {errors.storeGstin && (
                      <p className="text-red-500 text-xs mt-1">{errors.storeGstin}</p>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Card *
                    </label>
                    <input
                      type="text"
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.panCard ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                    {errors.panCard && (
                      <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>
                    )}
                  </div>

                  {/* Pin Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code *
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.pinCode ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="6-digit pin code"
                      maxLength={6}
                    />
                    {errors.pinCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
                    )}
                  </div>

                  {/* Store Address - Full Width */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Address *
                    </label>
                    <textarea
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none ${
                        errors.storeAddress ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter complete store address"
                    />
                    {errors.storeAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.storeAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition"
              >
                Add Dealer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default DealersList;