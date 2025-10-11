import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch: refetchParcels,
  } = useQuery({
    queryKey: ["parcels-for-assign"],
    queryFn: async () => (await axiosSecure.get("/parcels")).data,
  });

  const {
    data: availableRiders = [],
    refetch: refetchRiders,
    isFetching: ridersLoading,
  } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderRegion],
    queryFn: async () => {
      if (!selectedParcel) return [];
      return (
        await axiosSecure.get(
          `/riders/available?region=${selectedParcel.senderRegion}`
        )
      ).data;
    },
    enabled: !!selectedParcel,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Failed to load parcels.</p>;

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRider(null);
    refetchRiders();
  };

  const handleConfirmAssign = async () => {
    if (!selectedRider) return;

    const riderName = selectedRider.name || selectedRider.riderName;
    const riderEmail = selectedRider.email || selectedRider.riderEmail;

    try {
      const res = await axiosSecure.patch(
        `/parcels/${selectedParcel._id}/assign`,
        { riderEmail, riderName }
      );

      const updatedParcel = res.data.parcel;

      Swal.fire({
        icon: "success",
        title: "Rider Assigned!",
        html: `
          <p>Parcel <strong>${updatedParcel.parcelName}</strong> assigned to <strong>${riderName}</strong></p>
          <p>Email: ${riderEmail}</p>
          <p>Status: Rider Assigned</p>
        `,
        confirmButtonColor: "#FA2A3B",
      });

      refetchParcels();
      setSelectedParcel(null);
      setSelectedRider(null);
    } catch (err) {
      console.error("Error assigning rider:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not assign rider. Please try again.",
        confirmButtonColor: "#FA2A3B",
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedParcel(null);
    setSelectedRider(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-[#FA2A3B] ">
        Assign Rider to Parcels
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-[#FA2A3B] text-white uppercase tracking-wider">
              <th className="px-4 sm:px-6 py-3 text-left">Tracking ID</th>
              <th className="px-4 sm:px-6 py-3 text-left">Parcel</th>
              <th className="px-4 sm:px-6 py-3 text-left">Weight</th>
              <th className="px-4 sm:px-6 py-3 text-left">Sender</th>
              <th className="px-4 sm:px-6 py-3 text-left">Receiver</th>
              <th className="px-4 sm:px-6 py-3 text-left">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left">Delivery</th>
              <th className="px-4 sm:px-6 py-3 text-left">Price</th>
              <th className="px-4 sm:px-6 py-3 text-center">Action</th>
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
                <td className="px-4 sm:px-6 py-3 font-mono font-medium">
                  {parcel.trackingId}
                </td>
                <td className="px-4 sm:px-6 py-3">{parcel.parcelName}</td>
                <td className="px-4 sm:px-6 py-3">{parcel.parcelWeight} kg</td>
                <td className="px-4 sm:px-6 py-3">
                  <p className="font-semibold">{parcel.senderName}</p>
                  <p className="text-xs text-gray-600">{parcel.senderRegion}</p>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <p className="font-semibold">{parcel.receiverName}</p>
                  <p className="text-xs text-gray-600">
                    {parcel.receiverRegion}
                  </p>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {parcel.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                      parcel.deliveryStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : parcel.deliveryStatus === "In Transit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 font-bold">৳{parcel.price}</td>
                <td className="px-4 sm:px-6 py-3 text-center">
                  <button
                    onClick={() => handleAssignClick(parcel)}
                    className="bg-[#FA2A3B] text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#E02032] hover:scale-105 transition-all"
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedParcel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform animate-scaleIn">
            <h3 className="text-xl font-bold mb-4 text-center text-[#FA2A3B]">
              Select Rider for Parcel
            </h3>
            <p className="mb-4 text-gray-600 text-center">
              Parcel:{" "}
              <span className="font-semibold text-black">
                {selectedParcel.parcelName}
              </span>{" "}
              ({selectedParcel.trackingId})
            </p>

            {ridersLoading ? (
              <Loader />
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableRiders.length > 0 ? (
                  availableRiders.map((rider) => (
                    <div
                      key={rider._id}
                      className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedRider?._id === rider._id
                          ? "bg-[#FA2A3B]/10 border-[#FA2A3B]"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedRider(rider)}
                    >
                      <div>
                        <p className="font-semibold">{rider.name}</p>
                        <p className="text-xs text-gray-500">
                          Region: {rider.region}
                        </p>
                      </div>
                      {selectedRider?._id === rider._id && (
                        <span className="text-[#FA2A3B] font-bold animate-pulse">
                          ✓
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No available riders in this region.
                  </p>
                )}
              </div>
            )}

            {selectedRider && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50 shadow-inner animate-fadeIn">
                <p>
                  <strong>Email:</strong> {selectedRider.email}
                </p>
                <p>
                  <strong>Name:</strong> {selectedRider.name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-[#FA2A3B] font-semibold">
                    Rider Assigned
                  </span>
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                disabled={!selectedRider}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedRider
                    ? "bg-[#FA2A3B] text-white hover:bg-[#E02032] hover:scale-105"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
