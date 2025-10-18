import React, { useState } from "react";
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

const COLORS = ["#FA2A3B", "#E02032", "#FCD34D", "#34D399"];

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const email = user?.email;
  const [activeIndex, setActiveIndex] = useState(null);

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
      icon: (
        <FaBoxOpen className="w-12 h-12 text-[#FA2A3B] animate-pulse-slow" />
      ),
      color: "#FA2A3B",
    },
    {
      title: "Paid Parcels",
      value: summary?.paidParcels || 0,
      icon: (
        <FaMoneyBillWave className="w-12 h-12 text-[#34D399] animate-spin-slow" />
      ),
      color: "#34D399",
    },
    {
      title: "Pending Deliveries",
      value: summary?.pendingDeliveries || 0,
      icon: <FaClock className="w-12 h-12 text-[#FCD34D] animate-pulse-slow" />,
      color: "#FCD34D",
    },
    {
      title: "Total Spent",
      value: `৳${summary?.totalSpent || 0}`,
      icon: (
        <FaCheckCircle className="w-12 h-12 text-[#E02032] animate-pulse-slow" />
      ),
      color: "#E02032",
    },
  ];

  const handleMouseEnter = (_, index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-[#FA2A3B] drop-shadow-md">
        User Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-tr from-white to-[#fff0f0] p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3 transform transition hover:scale-105 hover:shadow-[0_0_40px_rgba(250,42,59,0.5)] border border-[#FA2A3B]/20 animate-pulse-card"
          >
            {card.icon}
            <h3 className="text-lg font-semibold text-gray-700">
              {card.title}
            </h3>
            <p
              className="text-3xl font-bold drop-shadow-md"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-gradient-to-tr from-white to-[#fff4f0] rounded-3xl shadow-2xl p-6 mb-8 border border-[#FA2A3B]/20">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-700 drop-shadow-sm">
          Parcel Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={parcelStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={5}
              cornerRadius={15}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              isAnimationActive
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {parcelStatusData.map((entry, index) => (
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
                    animation: `pulse-slice 2s infinite ease-in-out ${
                      index * 0.2
                    }s`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FAFAFA",
                borderRadius: "8px",
                border: "1px solid #FA2A3B",
                boxShadow: "0 0 20px rgba(250,42,59,0.3)",
                fontWeight: "bold",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.5s infinite;
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        @keyframes pulse-card {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 25px rgba(250, 42, 59, 0.2);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 35px rgba(250, 42, 59, 0.35);
          }
        }
        .animate-pulse-card {
          animation: pulse-card 2s infinite ease-in-out;
        }

        @keyframes pulse-slice {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
