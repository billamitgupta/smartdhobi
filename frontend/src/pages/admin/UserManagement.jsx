import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  MapPin,
  Clock,
  AlertCircle,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllUsers } from "../../auth/ApiConnect";
import UserAvatar from "../../components/basicComponent/UserAvatar";
import UserDetailModal from "./usercomponent/UserDetailModal";
import SearchAndFilter from "../../components/basicComponent/SearchAndFilter";

// User Table Row Component
const UserTableRow = ({ user, onViewDetails, onStatusChange }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <UserAvatar name={user.name} />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500 capitalize">{user.role}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 flex items-center">
        <Mail className="h-4 w-4 mr-2 text-gray-400" />
        {user.email}
      </div>
      <div className="text-sm text-gray-500 flex items-center">
        <Phone className="h-4 w-4 mr-2 text-gray-400" />
        {user.mobile}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
        {new Date(user.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={user.status} isVerified={user.isVerified} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
        <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
        {user.orders}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(user)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          View Details
        </button>
      </div>
    </td>
  </tr>
);

// Status Badge Component
const StatusBadge = ({ status, isVerified }) => (
  <div className="flex flex-col gap-1">
    {isVerified ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        Verified
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
        Not Verified
      </span>
    )}
  </div>
);

const StatCard = ({ title, value, change, color, icon: Icon }) => (
  <div
    className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm uppercase font-semibold">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p
          className={`text-xs mt-1 ${
            change.includes("↑") ? "text-green-600" : "text-gray-500"
          }`}
        >
          {change}
        </p>
      </div>
      <Icon className={`h-8 w-8 text-${color}-500`} />
    </div>
  </div>
);
// Users Table Component
const UsersTable = ({ users, onViewDetails, onStatusChange }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onViewDetails={onViewDetails}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No users found
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
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
);

// Main UserManagement Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  console.log(users, "users");

  // Filter and sort users
  const filteredAndSortedUsers = React.useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const suspended = users.filter((u) => u.status === "suspended").length;

    return {
      total,
      active,
      suspended,
    };
  }, [users]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      )
    );

    if (selectedUser && selectedUser._id === userId) {
      setSelectedUser((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Management
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.total}
            change="↑ 12% from last month"
            color="indigo"
            icon={Users}
          />
          <StatCard
            title="Active Users"
            value={stats.active}
            change="↑ 5% from last month"
            color="green"
            icon={Check}
          />
          <StatCard
            title="Suspended Users"
            value={stats.suspended}
            change="No change from last month"
            color="red"
            icon={AlertCircle}
          />
        </div>

        {/* Search and Filters */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <UsersTable
              users={currentUsers}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default UserManagement;
