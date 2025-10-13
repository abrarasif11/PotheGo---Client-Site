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
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
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
      <p className="text-gray-500 text-center mt-10">No deliveries yet.</p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-[#FA2A3B] ">
        Completed Deliveries
      </h2>

      {/* Desktop Table */}
      <div className="overflow-x-auto border rounded-lg hidden sm:block shadow-lg">
        <table className="w-full text-sm sm:text-base border-collapse">
          <thead className="bg-[#FA2A3B] text-white uppercase text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Title</th>
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
            {parcels.map((parcel, idx) => (
              <tr
                key={parcel._id}
                className={`transition-all duration-300 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#fff4f4] hover:scale-[1.01]`}
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3 font-mono font-medium">
                  {parcel.trackingId}
                </td>
                <td className="px-4 py-3">{parcel.parcelName}</td>
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
                <td className="px-4 py-3 font-semibold text-green-700">
                  {calculateEarning(parcel)}৳
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {parcel.picked_at
                    ? new Date(parcel.picked_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {parcel.delivered_at
                    ? new Date(parcel.delivered_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {parcel.cashout_status === "cashed_out" ? (
                    <span className="inline-block  px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-lg">
                      Cashed Out
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCashout(parcel._id)}
                      className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-all"
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
      <div className="sm:hidden grid gap-4">
        {parcels.map((parcel) => (
          <div
            key={parcel._id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all animate-fadeIn"
          >
            <p className="font-mono font-semibold text-sm mb-1">
              {parcel.trackingId}
            </p>
            <p className="font-semibold text-base mb-1">{parcel.parcelName}</p>
            <p className="text-sm mb-1">Weight: {parcel.parcelWeight} kg</p>
            <p className="text-sm mb-1">
              From: {parcel.senderName} ({parcel.senderRegion})
            </p>
            <p className="text-sm mb-1">
              To: {parcel.receiverName} ({parcel.receiverRegion})
            </p>
            <p className="text-sm mb-1">
              Fee: <span className="font-semibold">{parcel.price}৳</span>
            </p>
            <p className="text-sm mb-1">
              Your Earning:{" "}
              <span className="font-semibold text-green-700">
                {calculateEarning(parcel)}৳
              </span>
            </p>
            <p className="text-sm mb-1">
              Picked At:{" "}
              {parcel.picked_at
                ? new Date(parcel.picked_at).toLocaleString()
                : "-"}
            </p>
            <p className="text-sm mb-2">
              Delivered At:{" "}
              {parcel.delivered_at
                ? new Date(parcel.delivered_at).toLocaleString()
                : "-"}
            </p>
            {parcel.cashout_status === "cashed_out" ? (
              <span className="inline-block w-full text-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Cashed Out
              </span>
            ) : (
              <button
                onClick={() => handleCashout(parcel._id)}
                className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
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
