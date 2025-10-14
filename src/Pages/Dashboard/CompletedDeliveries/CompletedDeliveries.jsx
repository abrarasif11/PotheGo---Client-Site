import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/Loader/Loader";
import { FaCheckCircle } from "react-icons/fa";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `rider/completed-parcels?email=${encodeURIComponent(user.email)}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const calculateEarning = (parcel) => {
    const price = Number(parcel.price);
    return parcel.sender_center === parcel.receiver_center
      ? price * 0.8
      : price * 0.3;
  };

  const { mutateAsync: cashout } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
  });

  const handleCashout = (parcelId) => {
    Swal.fire({
      title: "Confirm Cashout",
      text: "You are about to cash out this delivery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FA2A3B",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        cashout(parcelId)
          .then(() => {
            Swal.fire("Success", "Cashout completed.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to cash out. Try again.", "error");
          });
      }
    });
  };

  if (isLoading) return <Loader />;

  if (!parcels || parcels.length === 0)
    return (
      <div className="p-6 text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No completed deliveries yet
        </h2>
        <p className="text-gray-500 text-sm">
          Once you deliver parcels, they’ll appear here.
        </p>
      </div>
    );

  return (
    <div className="p-3 sm:p-6 animate-fadeIn">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-10 text-center text-[#FA2A3B]">
          <FaCheckCircle className="text-[#E02032]" /> Completed Deliveries
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
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Fee (৳)</th>
              <th className="px-4 py-3">Earning (৳)</th>
              <th className="px-4 py-3">Picked At</th>
              <th className="px-4 py-3">Delivered At</th>
              <th className="px-4 py-3 text-center">Cashout</th>
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
                <td className="px-4 py-3 font-semibold text-green-700">
                  {calculateEarning(parcel)}৳
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {parcel.picked_at
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(new Date(parcel.picked_at))
                    : "-"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {parcel.delivered_at
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(new Date(parcel.delivered_at))
                    : "-"}
                </td>

                {/*  Updated Cashout Badge */}
                <td className="px-4 py-3 text-center">
                  {parcel.cashout_status === "cashed_out" ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 text-green-700">
                      Cashed Out
                    </span>
                  ) : (
                    <span
                      onClick={() => handleCashout(parcel._id)}
                      className="cursor-pointer px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-[#FA2A3B]/10 hover:text-[#FA2A3B] transition-all"
                    >
                      Cash Out
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {parcels.map((parcel, index) => (
          <div
            key={parcel._id}
            className="p-4 bg-white shadow-md rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                #{index + 1} • {parcel.parcelName}
              </h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                Completed
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Tracking ID:</strong> {parcel.trackingId}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>From:</strong> {parcel.senderName} ({parcel.senderRegion})
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>To:</strong> {parcel.receiverName} (
              {parcel.receiverRegion})
            </p>
            <p className="text-sm text-gray-800 font-semibold mb-1">
              Fee: {parcel.price}৳
            </p>
            <p className="text-sm text-green-700 font-semibold mb-1">
              Earning: {calculateEarning(parcel)}৳
            </p>

            <p className="text-xs text-gray-500 mb-1">
              Picked:{" "}
              {parcel.picked_at
                ? new Date(parcel.picked_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Delivered:{" "}
              {parcel.delivered_at
                ? new Date(parcel.delivered_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>

            {/* Mobile Cashout Badge */}
            {parcel.cashout_status === "cashed_out" ? (
              <span className="inline-block w-full text-center px-3 py-2 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Cashed Out
              </span>
            ) : (
              <span
                onClick={() => handleCashout(parcel._id)}
                className="inline-block w-full text-center px-3 py-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-[#FA2A3B]/10 hover:text-[#FA2A3B] transition-all cursor-pointer"
              >
                Cash Out
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
