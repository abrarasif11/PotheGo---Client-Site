import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

const COLORS = ["#FA2A3B", "#FF6B6B", "#FCD34D", "#34D399"]; 

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const email = user?.email;

  const { data: summary, isLoading } = useQuery({
    queryKey: ["userSummary", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/user/${email}/summary`);
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <Loader />;

  const parcelStatusData = [
    { name: "Delivered", value: summary?.deliveredParcels || 0 },
    { name: "Pending", value: summary?.pendingDeliveries || 0 },
    { name: "Paid", value: summary?.paidParcels || 0 },
    {
      name: "Unpaid",
      value: summary?.totalParcels - summary?.paidParcels || 0,
    },
  ];

  const summaryCards = [
    {
      title: "Total Parcels",
      value: summary?.totalParcels || 0,
      icon: <FaBoxOpen className="w-12 h-12 text-[#FA2A3B] " />,
      color: "#FA2A3B",
    },
    {
      title: "Paid Parcels",
      value: summary?.paidParcels || 0,
      icon: (
        <FaMoneyBillWave className="w-12 h-12 text-green-500 animate-spin-slow" />
      ),
      color: "green",
    },
    {
      title: "Pending Deliveries",
      value: summary?.pendingDeliveries || 0,
      icon: <FaClock className="w-12 h-12 text-yellow-500 " />,
      color: "yellow",
    },
    {
      title: "Total Spent",
      value: `৳${summary?.totalSpent || 0}`,
      icon: (
        <FaCheckCircle className="w-12 h-12 text-[#FA2A3B] " />
      ),
      color: "#FA2A3B",
    },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-[#FA2A3B] ">
         User Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3 transform transition hover:scale-105 hover:shadow-2xl"
          >
            {card.icon}
            <h3 className="text-lg font-semibold text-gray-700">
              {card.title}
            </h3>
            <p className={`text-3xl font-bold`} style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-700">
          Parcel Status
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={parcelStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={5}
              cornerRadius={10}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              isAnimationActive
            >
              {parcelStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserDashboard;
