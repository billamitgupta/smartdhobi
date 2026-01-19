import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAdminDashboardData } from "../../auth/ApiConnect";
import { useNavigate } from "react-router-dom";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    providersCount: 0,
    ordersCount: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboardData();
        setStats(res);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
      <StatCard
        title="Users"
        value={stats.usersCount}
        onClick={() => navigate("users")}
      />
      <StatCard
        title="Providers"
        value={stats.providersCount}
        onClick={() => navigate("vendors")}
      />
      <StatCard
        title="Orders"
        value={stats.ordersCount}
        onClick={() => navigate("orders")}
      />
      <StatCard
        title="Total Earnings"
        value={`₹${stats.totalEarnings.toFixed(2)}`}
        onClick={() => navigate("orders")}
      />
    </div>
  );
};

const StatCard = ({ title, value, onClick}) => (
  <div
    className="bg-white shadow-md rounded-xl p-5 text-center cursor-pointer"
    onClick={onClick}
  >
    <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
    <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

export default DashboardStats;
