import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/Loader/Loader";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch completed deliveries
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

  // Calculate rider earning
  const calculateEarning = (parcel) => {
    const price = Number(parcel.price);
    return parcel.sender_center === parcel.receiver_center
      ? price * 0.8
      : price * 0.3;
  };

  // Cashout mutation
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
      confirmButtonColor: "#FA2A3B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Cash Out",
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No completed deliveries yet.
        </h2>
        <p className="text-gray-500 text-sm">
          Once you finish deliveries, they’ll appear here.
        </p>
      </div>
    );

  return (
    <div className="p-3 sm:p-6 animate-fadeIn">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#FA2A3B] text-center">
        Completed Deliveries
      </h2>

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
              <th className="px-4 py-3">Your Earning (৳)</th>
              <th className="px-4 py-3">Picked At</th>
              <th className="px-4 py-3">Delivered At</th>
              <th className="px-4 py-3 text-center">Cashout</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr
                key={parcel._id}
                className={`border-t transition-all duration-300 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#FA2A3B]/5 hover:scale-[1.01]`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 font-mono">
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
                        month: "short",
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
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(new Date(parcel.delivered_at))
                    : "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  {parcel.cashout_status === "cashed_out" ? (
                    <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full min-w-[90px]">
                      Cashed Out
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCashout(parcel._id)}
                      className="px-3 py-1 text-xs font-medium text-white bg-[#FA2A3B] rounded hover:bg-[#E02032] transition-all shadow-md hover:scale-105"
                    >
                      Cashout
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
        {parcels.map((parcel, index) => (
          <div
            key={parcel._id}
            className="p-4 bg-white shadow-md rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                #{index + 1} • {parcel.parcelName}
              </h3>
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
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
            <p className="text-sm text-gray-800 font-semibold">
              💰 {parcel.price}৳ —{" "}
              <span className="text-green-700 font-bold">
                Earned: {calculateEarning(parcel)}৳
              </span>
            </p>

            <p className="text-sm mt-1 text-gray-600">
              <strong>Picked:</strong>{" "}
              {parcel.picked_at
                ? new Date(parcel.picked_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>

            <p className="text-sm text-gray-600 mb-3">
              <strong>Delivered:</strong>{" "}
              {parcel.delivered_at
                ? new Date(parcel.delivered_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>

            {parcel.cashout_status === "cashed_out" ? (
              <span className="inline-block w-full text-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Cashed Out
              </span>
            ) : (
              <button
                onClick={() => handleCashout(parcel._id)}
                className="w-full bg-[#FA2A3B] text-white py-2 rounded-lg font-semibold hover:bg-[#E02032] transition-all hover:scale-105 shadow-md"
              >
                Cashout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
