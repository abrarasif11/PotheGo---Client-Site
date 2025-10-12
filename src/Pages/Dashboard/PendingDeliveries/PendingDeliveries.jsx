import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: parcelsData, isLoading } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:6969/riders/pendingDeliveries?email=${user?.email}`
      );
      return res.data;
    },
  });

  const parcels = Array.isArray(parcelsData) ? parcelsData : [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcel, status }) => {
      const res = await axios.patch(
        `http://localhost:6969/parcels/${parcel._id}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingDeliveries", user?.email]);
      Swal.fire(" Success", "Parcel status updated successfully!", "success");
    },
    onError: (err) => {
      Swal.fire(" Error", err.message, "error");
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
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🚚 No pending deliveries
        </h2>
        <p className="text-gray-500 text-sm">
          Once a parcel is assigned to you, it’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        🚚 Pending Deliveries
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
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
            {parcels.map((parcel, index) => (
              <tr
                key={parcel._id}
                className={`border-t transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {parcel.trackingId}
                </td>
                <td className="px-4 py-3">{parcel.parcelName}</td>
                <td className="px-4 py-3">{parcel.parcelWeight} kg</td>
                <td className="px-4 py-3">
                  <div>{parcel.senderName}</div>
                  <div className="text-xs text-gray-500">
                    {parcel.senderRegion}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>{parcel.receiverName}</div>
                  <div className="text-xs text-gray-500">
                    {parcel.receiverRegion}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {parcel.price}৳
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full min-w-[90px] ${
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
                      className="px-3 py-1 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all w-full sm:w-auto"
                    >
                      Mark Picked Up
                    </button>
                  )}

                  {parcel.deliveryStatus === "In Transit" && (
                    <button
                      onClick={() => handleStatusChange(parcel, "Delivered")}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-[#FA2A3B] text-white hover:bg-[#E02032] transition-all w-full sm:w-auto"
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
    </div>
  );
};

export default PendingDeliveries;
