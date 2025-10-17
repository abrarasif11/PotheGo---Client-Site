import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { FaClock } from "react-icons/fa";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();

  const { data: parcelsData, isLoading } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `https://pothe-go-server.vercel.app/riders/pendingDeliveries?email=${encodeURIComponent(
          user?.email
        )}`
      );
      return res.data;
    },
  });

  const parcels = Array.isArray(parcelsData) ? parcelsData : [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcel, status }) => {
      await axios.patch(
        `https://pothe-go-server.vercel.app/parcels/${parcel._id}/status`,
        {
          status,
        }
      );
      return { parcel, status };
    },
    onSuccess: ({ parcel, status }) => {
      queryClient.invalidateQueries(["pendingDeliveries", user?.email]);
      Swal.fire("Success", "Parcel status updated!", "success");

      if (status === "In Transit" || status === "Delivered") {
        logTracking({
          trackingId: parcel.trackingId,
          status,
          details: `Parcel marked as ${status}`,
          updatedBy: user?.email || "system",
        });
      }
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Failed to update status", "error");
      console.error(err);
    },
  });

  const handleStatusChange = (parcel, newStatus) => {
    Swal.fire({
      title: `Mark this parcel as "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FA2A3B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ parcel, status: newStatus });
      }
    });
  };

  if (isLoading) return <Loader />;

  if (parcels.length === 0) {
    return (
      <div className="p-6 text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No pending deliveries
        </h2>
        <p className="text-gray-500 text-sm">
          Once a parcel is assigned to you, it’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 animate-fadeIn">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-10 text-center text-[#FA2A3B]">
          <FaClock className="text-[#E02032]" /> Pending Deliveries
        </h1>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white transition-all duration-500 hover:shadow-2xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#FA2A3B]/10 text-[#FA2A3B] uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Parcel</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Sender</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, idx) => (
              <tr
                key={parcel._id}
                className={`border-t transition-all duration-300 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#FA2A3B]/5 hover:scale-[1.01]`}
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {parcel.trackingId}
                </td>
                <td className="px-4 py-3">{parcel.parcelName}</td>
                <td className="px-4 py-3">{parcel.parcelWeight} kg</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{parcel.senderName}</div>
                  <div className="text-xs text-gray-500">
                    {parcel.senderRegion}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{parcel.receiverName}</div>
                  <div className="text-xs text-gray-500">
                    {parcel.receiverRegion}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {parcel.price}৳
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full min-w-[90px] shadow-sm transition-all duration-300 ${
                      parcel.deliveryStatus === "Rider Assigned"
                        ? "bg-yellow-100 text-yellow-700"
                        : parcel.deliveryStatus === "In Transit"
                        ? "bg-blue-100 text-blue-700"
                        : parcel.deliveryStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex flex-col sm:flex-row justify-center gap-2">
                  {parcel.deliveryStatus === "Rider Assigned" && (
                    <button
                      onClick={() => handleStatusChange(parcel, "In Transit")}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all hover:scale-105 w-full sm:w-auto shadow-md"
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {parcel.deliveryStatus === "In Transit" && (
                    <button
                      onClick={() => handleStatusChange(parcel, "Delivered")}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all hover:scale-105 w-full sm:w-auto shadow-md"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {parcels.map((parcel, idx) => (
          <div
            key={parcel._id}
            className="p-4 bg-white shadow-md rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                #{idx + 1} • {parcel.parcelName}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  parcel.deliveryStatus === "Rider Assigned"
                    ? "bg-yellow-100 text-yellow-700"
                    : parcel.deliveryStatus === "In Transit"
                    ? "bg-blue-100 text-blue-700"
                    : parcel.deliveryStatus === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {parcel.deliveryStatus}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Tracking ID:</strong> {parcel.trackingId}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Weight:</strong> {parcel.parcelWeight} kg
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Sender:</strong> {parcel.senderName} (
              {parcel.senderRegion})
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Receiver:</strong> {parcel.receiverName} (
              {parcel.receiverRegion})
            </p>
            <p className="text-sm text-gray-800 font-semibold">
              💰 {parcel.price}৳
            </p>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              {parcel.deliveryStatus === "Rider Assigned" && (
                <button
                  onClick={() => handleStatusChange(parcel, "In Transit")}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all hover:scale-105"
                >
                  Mark Picked Up
                </button>
              )}
              {parcel.deliveryStatus === "In Transit" && (
                <button
                  onClick={() => handleStatusChange(parcel, "Delivered")}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all hover:scale-105"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingDeliveries;
