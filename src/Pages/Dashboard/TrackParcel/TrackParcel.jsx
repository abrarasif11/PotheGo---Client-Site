import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaTruck,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaWarehouse,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/Loader/Loader";

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

  if (parcelsLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FA2A3B]/10 via-white to-[#E02032]/10 p-5 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">📦 My Parcels</h1>
        <p className="text-gray-500">Track and manage your deliveries easily</p>
      </motion.div>

      {/* Parcels List */}
      <div className="mb-8">
        {parcelsError && (
          <p className="text-red-500 text-center">Error loading parcels.</p>
        )}
        {!parcelsLoading && parcels.length === 0 && (
          <p className="text-gray-500 text-center">You have no parcels.</p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {parcels.map((parcel, index) => (
            <motion.div
              key={parcel._id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => handleParcelSelect(parcel)}
              className={`p-5 rounded-2xl shadow-lg cursor-pointer border ${
                selectedParcel?._id === parcel._id
                  ? "bg-[#FA2A3B]/10 border-[#FA2A3B]"
                  : "bg-white border-gray-100 hover:border-[#FA2A3B]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaBoxOpen className="text-[#FA2A3B] text-2xl" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {parcel.parcelName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Tracking ID: {parcel.trackingId}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    parcel.deliveryStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {parcel.deliveryStatus}
                </span>
                <FaTruck
                  className={`text-xl ${
                    parcel.deliveryStatus === "Delivered"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Selected Parcel Details */}
      {selectedParcel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Parcel Details */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-[#FA2A3B] flex items-center gap-2">
              <FaBoxOpen /> Parcel Details
            </h2>

            <div className="space-y-2 text-gray-700">
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
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedParcel.deliveryStatus === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedParcel.deliveryStatus}
                </span>
              </p>
            </div>

            {/* Sender Info */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaUser className="text-[#FA2A3B]" /> Sender Info
              </h3>
              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedParcel.senderName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedParcel.senderEmail}
                </p>
                <p>
                  <strong>Region:</strong> {selectedParcel.senderRegion}
                </p>
                <p>
                  <strong>Warehouse:</strong> {selectedParcel.senderWarehouse}
                </p>
                <p>
                  <strong>Address:</strong> {selectedParcel.senderAddress}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedParcel.senderContact}
                </p>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#FA2A3B]" /> Receiver Info
              </h3>
              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedParcel.receiverName}
                </p>
                <p>
                  <strong>Region:</strong> {selectedParcel.receiverRegion}
                </p>
                <p>
                  <strong>Warehouse:</strong> {selectedParcel.receiverWarehouse}
                </p>
                <p>
                  <strong>Address:</strong> {selectedParcel.receiverAddress}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedParcel.receiverContact}
                </p>
              </div>
            </div>

            {/* Rider Info */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaTruck className="text-[#FA2A3B]" /> Assigned Rider
              </h3>
              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedParcel.assignedRiderName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedParcel.assignedRiderEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Updates */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-[#FA2A3B] flex items-center gap-2">
              <FaClock /> Tracking Updates
            </h2>

            {updatesLoading && <Loader />}
            {updatesError && (
              <p className="text-red-500">Error fetching updates.</p>
            )}
            {!updatesLoading && updates.length === 0 && (
              <p className="text-gray-500">No updates found.</p>
            )}

            <div className="relative border-l-2 border-[#FA2A3B]/40 pl-6 space-y-6">
              {updates.map((update, i) => (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="relative"
                >
                  <span className="absolute -left-3 top-1 bg-[#FA2A3B] text-white w-6 h-6 flex items-center justify-center rounded-full shadow">
                    <FaCheckCircle className="text-xs" />
                  </span>
                  <p className="text-gray-500 text-sm ml-5">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-800 font-semibold ml-5">
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
