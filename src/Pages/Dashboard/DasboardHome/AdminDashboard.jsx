import React, { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(null);

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
      icon: (
        <FaTruck className="text-[#4299e1] w-10 h-10 animate-bounce-slow" />
      ),
    },
    "Rider Assigned": {
      icon: (
        <FaMotorcycle className="text-[#ed8936] w-10 h-10 animate-bounce-slow" />
      ),
    },
    Delivered: {
      icon: (
        <FaCheckCircle className="text-[#48bb78] w-10 h-10 animate-bounce-slow" />
      ),
    },
    Processing: {
      icon: (
        <FaBoxOpen className="text-[#9f7aea] w-10 h-10 animate-bounce-slow" />
      ),
    },
  };

  const handleMouseEnter = (index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#FA2A3B] animate-fadeIn drop-shadow-lg">
        📦 Parcel Status Dashboard
      </h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, idx) => {
          const config = statusConfig[item.status] || {
            icon: (
              <FaBoxOpen className="text-gray-400 w-10 h-10 animate-bounce-slow" />
            ),
          };
          const percent = ((item.count / total) * 100).toFixed(1);

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-2xl p-5 flex items-center gap-4 transition-transform transform hover:scale-105 hover:shadow-[0_0_30px_rgba(250,42,59,0.5)] border border-[#FA2A3B]/20 relative"
            >
              <div className="flex-shrink-0">{config.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.status}
                </h3>
                <p className="text-3xl font-bold text-[#FA2A3B]">
                  {item.count}
                </p>
                <p className="text-sm text-gray-500">{percent}% of total</p>
                <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-1 rounded-full bg-[#FA2A3B] transition-all duration-1000 ease-in-out"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 border border-[#FA2A3B]/20 animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800 drop-shadow-md">
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
              cornerRadius={15}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              onMouseEnter={(_, index) => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {stats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
                    transform:
                      activeIndex === index ? "scale(1.1)" : "scale(1)",
                    filter: `drop-shadow(0 0 ${
                      activeIndex === index ? 25 : 10
                    }px ${COLORS[index % COLORS.length]})`,
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} parcels`, name]}
              contentStyle={{
                backgroundColor: "#FAFAFA",
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 0 20px rgba(250,42,59,0.3)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
