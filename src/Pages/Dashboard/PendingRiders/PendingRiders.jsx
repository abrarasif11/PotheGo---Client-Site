import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaUserClock } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    isLoading,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("riders/pending");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const handleStatusUpdate = async (riderId, status) => {
    const actionText = status === "Active" ? "Approve" : "Reject";

    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`riders/${riderId}`, { status });
        Swal.fire(
          "Success!",
          `Rider ${actionText.toLowerCase()}ed successfully.`,
          "success"
        );
        refetch();
        setSelectedRider(null);
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || err.message,
          "error"
        );
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-[#fff5f5]">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mt-5 flex items-center gap-3 text-[#FA2A3B]">
          <FaUserClock className="text-[#E02032]" /> Pending Riders
        </h1>
      </div>

      {riders.length === 0 ? (
        <p className="text-center text-gray-500">No pending riders found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <thead className="bg-gradient-to-r from-[#FA2A3B] to-[#E02032] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Region</th>
                  <th className="px-4 py-3 text-left">District</th>
                  <th className="px-4 py-3 text-left">Applied At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, idx) => (
                  <tr
                    key={rider._id}
                    className={`transition-all duration-200 hover:bg-[#fff2f3] ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-[#FA2A3B]">
                      {rider.name}
                    </td>
                    <td className="px-4 py-3">{rider.email}</td>
                    <td className="px-4 py-3">{rider.contact || "-"}</td>
                    <td className="px-4 py-3">{rider.region}</td>
                    <td className="px-4 py-3">{rider.warehouse}</td>
                    <td className="px-4 py-3">
                      {rider.createdAt
                        ? new Date(rider.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedRider(rider)}
                        className="text-white bg-[#3B82F6] p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(rider._id, "Active")}
                        className="text-white bg-[#22C55E] p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "Rejected")
                        }
                        className="text-white bg-[#EF4444] p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {riders.map((rider) => (
              <div
                key={rider._id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#FA2A3B]">
                    {rider.name}
                  </h3>
                  <span className="text-xs text-gray-500">{rider.region}</span>
                </div>
                <p className="text-sm text-gray-600">{rider.email}</p>
                <p className="text-sm text-gray-600">{rider.contact || "-"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Applied:{" "}
                  {rider.createdAt
                    ? new Date(rider.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </p>
                <div className="flex justify-between mt-3 gap-2">
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="bg-[#3B82F6] text-white p-2 rounded-lg shadow-md flex-1 hover:scale-105 transition-transform flex justify-center"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(rider._id, "Active")}
                    className="bg-[#22C55E] text-white p-2 rounded-lg shadow-md flex-1 hover:scale-105 transition-transform flex justify-center"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(rider._id, "Rejected")}
                    className="bg-[#EF4444] text-white p-2 rounded-lg shadow-md flex-1 hover:scale-105 transition-transform flex justify-center"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rider Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative">
            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-3 right-3 text-black text-lg font-bold hover:text-[#E02032] transition"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#E02032] text-center">
              Rider Details
            </h3>
            <div className="space-y-2 text-black">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRider.contact || "-"}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>Warehouse:</strong> {selectedRider.warehouse}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {selectedRider.createdAt
                  ? new Date(selectedRider.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </p>
            </div>
            <div className="mt-6 flex justify-between gap-2">
              <button
                onClick={() => handleStatusUpdate(selectedRider._id, "Active")}
                className="flex-1 bg-[#22C55E] text-white p-3 rounded-xl flex justify-center items-center hover:scale-105 transition-transform"
              >
                <FaCheck className="mr-2" /> Approve
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(selectedRider._id, "Rejected")
                }
                className="flex-1 bg-[#EF4444] text-white p-3 rounded-xl flex justify-center items-center hover:scale-105 transition-transform"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
