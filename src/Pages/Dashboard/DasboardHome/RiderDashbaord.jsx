import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaWarehouse,
  FaPhoneAlt,
  FaIdCard,
  FaClock,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const RiderDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const email = user?.email;

  const { data: riderProfile, isLoading } = useQuery({
    queryKey: ["riderProfile", email],
    queryFn: async () => {
      const res = await axiosSecure.get("riders/profile", {
        params: { email },
      });
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <Loader />;

  const statusColor =
    riderProfile?.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FA2A3B]/10 via-white to-[#E02032]/10 p-4 sm:p-6 flex flex-col items-center">
      {/* Profile Avatar Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col items-center text-center"
      >
        <div className="w-28 h-28 rounded-full border-4 border-[#FA2A3B] overflow-hidden shadow-md">
          <img
            src={
              riderProfile?.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold mt-4 text-gray-800">
          {riderProfile?.name || "Rider"}
        </h2>

        <p className="text-gray-500 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base mt-1">
          <FaEnvelope className="text-[#FA2A3B]" /> {riderProfile?.email}
        </p>

        {/* Status Badge */}
        <span
          className={`mt-3 px-4 py-1 text-sm font-semibold rounded-full ${statusColor}`}
        >
          {riderProfile?.status === "active" ? "Active" : "Active"}
        </span>
      </motion.div>

      {/* Profile Info Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white mt-8 p-5 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-4 text-[#FA2A3B]">
          Rider Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {[
            {
              icon: <FaUser className="text-[#FA2A3B]" />,
              label: "Name",
              value: riderProfile?.name || "-",
            },
            {
              icon: <FaBirthdayCake className="text-[#FA2A3B]" />,
              label: "Age",
              value: riderProfile?.age || "N/A",
            },
            {
              icon: <FaMapMarkerAlt className="text-[#FA2A3B]" />,
              label: "Region",
              value: riderProfile?.region || "Not Assigned",
            },
            {
              icon: <FaWarehouse className="text-[#FA2A3B]" />,
              label: "Warehouse",
              value: riderProfile?.warehouse || "Not Assigned",
            },
            {
              icon: <FaPhoneAlt className="text-[#FA2A3B]" />,
              label: "Contact",
              value: riderProfile?.contact || "N/A",
            },
            {
              icon: <FaIdCard className="text-[#FA2A3B]" />,
              label: "NID",
              value: riderProfile?.nid || "Not Provided",
            },
            {
              icon: <FaClock className="text-[#FA2A3B]" />,
              label: "Joined",
              value: riderProfile?.createdAt
                ? new Date(riderProfile.createdAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-all duration-200 text-sm sm:text-base"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-gray-700">
                  {item.label}
                </span>
              </div>
              <span className="text-gray-800 font-medium text-right">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RiderDashboard;
