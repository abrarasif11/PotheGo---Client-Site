import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaBox,
  FaClock,
  FaTruck,
  FaUserAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaWarehouse,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const TrackParcelPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
  } = useQuery({
    queryKey: ["userParcels", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`parcels?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const {
    data: updates = [],
    refetch: refetchUpdates,
    isLoading: updatesLoading,
    isError: updatesError,
  } = useQuery({
    queryKey: ["tracking", selectedParcel?.trackingId],
    queryFn: async () => {
      if (!selectedParcel?.trackingId) return [];
      const res = await axiosSecure.get(
        `trackings/${selectedParcel.trackingId}`
      );
      return res.data;
    },
    enabled: !!selectedParcel?.trackingId,
  });

  const handleParcelSelect = (parcel) => {
    setSelectedParcel(parcel);
    refetchUpdates();
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FaBox className="text-[#FA2A3B]" /> My Parcels
        </h1>
        <p className="text-gray-500 mb-6">
          View your parcels and track their current status in real time.
        </p>
      </motion.div>
      {/* Parcels List */}
      <div className="mb-8">
        {parcelsLoading && <p>Loading your parcels...</p>}
        {parcelsError && <p className="text-red-500">Error loading parcels.</p>}
        {!parcelsLoading && parcels.length === 0 && (
          <p className="text-gray-500">You have no parcels yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parcels.map((parcel) => (
            <motion.div
              key={parcel._id}
              onClick={() => handleParcelSelect(parcel)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-xl shadow-md cursor-pointer border transition-all duration-300 ${
                selectedParcel?._id === parcel._id
                  ? "bg-[#FA2A3B]/10 border-[#FA2A3B]"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                  <FaBox className="text-[#FA2A3B]" /> {parcel.parcelName}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    parcel.deliveryStatus === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {parcel.deliveryStatus}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Tracking ID:{" "}
                <span className="font-medium text-gray-800">
                  {parcel.trackingId}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Selected Parcel Details */}
      {selectedParcel && (
        <motion.div
          key={selectedParcel._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Parcel Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#FA2A3B]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaTruck className="text-[#FA2A3B]" /> Parcel Details
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Name:</strong> {selectedParcel.parcelName}
              </p>
              <p>
                <strong>Weight:</strong> {selectedParcel.parcelWeight} KG
              </p>
              <p>
                <strong>Type:</strong> {selectedParcel.parcelType}
              </p>
              <p>
                <strong>Price:</strong> ${selectedParcel.price}
              </p>
              <p>
                <strong>Tracking Code:</strong> {selectedParcel.trackingId}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {selectedParcel.createdAt
                  ? new Date(selectedParcel.createdAt).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-"}
              </p>
            </div>
            {/* Sender Info */}
            <div className="mt-5">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaUserAlt className="text-[#FA2A3B]" /> Sender Info
              </h3>
              <div className="space-y-1 text-gray-600 text-sm">
                <p>
                  <FaEnvelope className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.senderEmail}
                </p>
                <p>
                  <FaPhoneAlt className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.senderContact}
                </p>
                <p>
                  <FaMapMarkerAlt className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.senderAddress}
                </p>
                <p>
                  <FaWarehouse className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.senderWarehouse}
                </p>
              </div>
            </div>
            {/* Receiver Info */}
            <div className="mt-5">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaUserAlt className="text-[#FA2A3B]" /> Receiver Info
              </h3>
              <div className="space-y-1 text-gray-600 text-sm">
                <p>
                  <FaPhoneAlt className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.receiverContact}
                </p>
                <p>
                  <FaMapMarkerAlt className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.receiverAddress}
                </p>
                <p>
                  <FaWarehouse className="inline text-[#FA2A3B]" />{" "}
                  {selectedParcel.receiverWarehouse}
                </p>
              </div>
            </div>
          </div>
          {/* Tracking Updates */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#FA2A3B]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaClock className="text-[#FA2A3B]" /> Tracking Updates
            </h2>

            {updatesLoading && <p>Loading updates...</p>}
            {updatesError && (
              <p className="text-red-500">Error fetching updates.</p>
            )}
            {!updatesLoading && updates.length === 0 && (
              <p className="text-gray-500">No updates found.</p>
            )}
            <div className="relative border-l border-gray-300 pl-6 space-y-6">
              {updates.map((update) => (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <span className="absolute -left-3 top-1 bg-[#FA2A3B]/20 text-[#FA2A3B] w-5 h-5 flex items-center justify-center rounded-full">
                    ✓
                  </span>
                  <p className="text-gray-500 text-sm ml-5">
                    {new Date(update.timestamp).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-gray-800 font-medium ml-5">
                    {update.status}
                  </p>
                  {update.details && (
                    <p className="text-gray-500 text-sm ml-5">
                      {update.details}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackParcelPage;
