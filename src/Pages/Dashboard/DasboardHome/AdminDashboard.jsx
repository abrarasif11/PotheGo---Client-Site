import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTruck,
  FaMotorcycle,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const COLORS = ["#FA2A3B", "#E02032", "#48BB78", "#9F7AEA"]; // Project theme colors

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: stats = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcel-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-6">
        Failed to load parcel status data.
      </p>
    );

  const total = stats.reduce((acc, item) => acc + item.count, 0);

  const statusConfig = {
    "In Transit": {
      icon: <FaTruck className="text-[#4299e1] w-10 h-10 animate-bounce" />,
    },
    "Rider Assigned": {
      icon: (
        <FaMotorcycle className="text-[#ed8936] w-10 h-10 animate-bounce" />
      ),
    },
    Delivered: {
      icon: (
        <FaCheckCircle className="text-[#48bb78] w-10 h-10 animate-bounce" />
      ),
    },
    Processing: {
      icon: <FaBoxOpen className="text-[#9f7aea] w-10 h-10 animate-bounce" />,
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#FA2A3B] animate-fadeIn">
        📦 Parcel Status Dashboard
      </h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, idx) => {
          const config = statusConfig[item.status] || {
            icon: (
              <FaBoxOpen className="text-gray-400 w-10 h-10 animate-bounce" />
            ),
          };
          const percent = ((item.count / total) * 100).toFixed(1);
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex-shrink-0">{config.icon}</div>
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.status}
                </h3>
                <p className="text-3xl font-bold text-[#FA2A3B]">
                  {item.count}
                </p>
                <p className="text-sm text-gray-500">{percent}% of total</p>
                <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-1 rounded-full bg-[#FA2A3B] transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
          Delivery Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={5}
              cornerRadius={10}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              isAnimationActive={true}
            >
              {stats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} parcels`, name]}
              contentStyle={{
                backgroundColor: "#FAFAFA",
                borderRadius: "10px",
                border: "none",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
