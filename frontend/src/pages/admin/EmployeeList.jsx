import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, User, Plus, X, CheckCircle } from "lucide-react";

const EmployeeList = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "employee",
    panCard: "",
    aadharCard: "",
  });

  const [errors, setErrors] = useState({});

  const filtered = employees.filter((e) => {
    if (!e) return false;
    const name = (e.name || "").toLowerCase();
    const email = (e.email || "").toLowerCase();
    const mobile = (e.mobile || "").toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      name.includes(searchLower) ||
      email.includes(searchLower) ||
      mobile.includes(searchLower)
    );
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be 10 digits";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";

    // Add PAN Card validation
    if (!formData.panCard) newErrors.panCard = "PAN Card is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard))
      newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";

    // Add Aadhar Card validation
    if (!formData.aadharCard) newErrors.aadharCard = "Aadhar Card is required";
    else if (!/^\d{12}$/.test(formData.aadharCard))
      newErrors.aadharCard = "Aadhar must be 12 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "employee",
      panCard: "",
      aadharCard: "",
    });
    setErrors({});
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/employee-register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    
    // Close modal
    closeModal();
    
    // Refresh the employee list from the server
    await fetchEmployees();
    
  } catch (error) {
    alert("Server Error!");
    console.error("Add Employee Error:", error);
  }
};

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/getAllEmployees`,
        { method: "GET" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch employees");
        return;
      }

      if (data.data && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else {
        console.error("Invalid data format:", data);
        setEmployees([]);
      }
    } catch (error) {
      alert("Server Error!");
      console.error("Fetch Employees Error:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="font-semibold">Employee added successfully!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee List</h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
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
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} employees found
      </p>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm w-[30%]">
                Name
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm w-[35%]">
                Email
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm w-[20%]">
                Contact
              </th>
              <th className="py-3 px-4 font-medium text-gray-600 text-sm w-[15%]">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  Loading employees...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition"
                >
                  {/* Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-700" />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {emp.name}
                      </p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{emp.mobile || "-"}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 text-sm font-semibold text-gray-800 text-center">
                    {(emp.role || "employee").toString().toUpperCase()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                Add New Employee
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <Input
                label="Full Name *"
                name="name"
                value={formData.name}
                error={errors.name}
                placeholder="Enter full name"
                onChange={handleChange}
              />

              {/* Email */}
              <Input
                label="Email *"
                name="email"
                value={formData.email}
                error={errors.email}
                placeholder="email@example.com"
                onChange={handleChange}
              />

              {/* Mobile */}
              <Input
                label="Mobile *"
                name="mobile"
                value={formData.mobile}
                error={errors.mobile}
                placeholder="10-digit number"
                onChange={handleChange}
              />
              <Input
                label="Aadhar Card *"
                name="aadharCard"
                value={formData.aadharCard}
                error={errors.aadharCard}
                placeholder="12-digit Aadhar number"
                onChange={handleChange}
              />
              <Input
                label="PAN Card *"
                name="panCard"
                value={formData.panCard}
                error={errors.panCard}
                placeholder="ABCDE1234F"
                onChange={handleChange}
              />

              {/* Password */}
              <Input
                label="Password *"
                name="password"
                value={formData.password}
                error={errors.password}
                placeholder="Enter password"
                type="password"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
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
                Add Employee
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

const Input = ({
  label,
  name,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
        error ? "border-red-500" : "border-gray-200"
      }`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default EmployeeList;
