import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "approved" });
      Swal.fire(
        "Approved!",
        "Rider has been approved successfully.",
        "success"
      );
      refetch();
    } catch {
      Swal.fire("Error", "Failed to approve rider.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.delete(`/riders/${id}`);
      Swal.fire("Rejected", "Rider application has been rejected.", "info");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to reject rider.", "error");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-[#fff5f5] text-black">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#E02032]">
        Pending Riders
      </h2>

      {/* Desktop Table */}
      {riders.length === 0 ? (
        <p className="text-center text-gray-500">No pending riders found.</p>
      ) : (
        <div className="overflow-x-auto hidden md:block">
          <table className="table w-full rounded-2xl shadow-lg border border-gray-200 bg-white">
            <thead className="bg-gradient-to-r from-[#FA2A3B] to-[#E02032] text-white text-center">
              <tr>
                <th className="py-3">#</th>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Contact</th>
                <th className="py-3">Region</th>
                <th className="py-3">District</th>
                <th className="py-3">Applied At</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr
                  key={rider._id}
                  className="hover:bg-[#fff2f3] transition-all duration-200 text-center"
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 font-semibold text-[#FA2A3B]">
                    {rider.name}
                  </td>
                  <td className="py-3">{rider.email}</td>
                  <td className="py-3">{rider.contact}</td>
                  <td className="py-3">{rider.region}</td>
                  <td className="py-3">{rider.warehouse}</td>
                  <td className="px-4 py-3 text-black">
                    {rider.createdAt
                      ? new Date(rider.createdAt).toLocaleString("en-GB", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="py-3 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="bg-[#3B82F6] hover:bg-[#2563eb] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleApprove(rider._id)}
                      className="bg-[#22C55E] hover:bg-[#16a34a] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                      title="Approve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleReject(rider._id)}
                      className="bg-[#EF4444] hover:bg-[#dc2626] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                      title="Reject"
                    >
                      <FaTimesCircle />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {riders.map((rider) => (
          <div
            key={rider._id}
            className="bg-white border rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-[#FA2A3B]">{rider.name}</span>
              <span className="text-xs text-gray-500">{rider.region}</span>
            </div>
            <p className="text-sm text-gray-600">{rider.email}</p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setSelectedRider(rider)}
                className="bg-[#3B82F6] hover:bg-[#2563eb] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                title="View"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleApprove(rider._id)}
                className="bg-[#22C55E] hover:bg-[#16a34a] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                title="Approve"
              >
                <FaCheckCircle />
              </button>
              <button
                onClick={() => handleReject(rider._id)}
                className="bg-[#EF4444] hover:bg-[#dc2626] text-white p-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
                title="Reject"
              >
                <FaTimesCircle />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#E02032]"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center text-[#E02032]">
              Rider Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <b>Name:</b> {selectedRider.name}
              </p>
              <p>
                <b>Email:</b> {selectedRider.email}
              </p>
              <p>
                <b>Contact:</b> {selectedRider.contact}
              </p>
              <p>
                <b>Region:</b> {selectedRider.region}
              </p>
              <p>
                <b>Warehouse:</b> {selectedRider.warehouse}
              </p>
              <p className="text-gray-500 text-xs">
                Joined:{" "}
                {new Date(selectedRider.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <div className="flex justify-between mt-6 gap-2">
              <button
                onClick={() => handleApprove(selectedRider._id)}
                className="bg-[#22C55E] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg w-1/2 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
              >
                <FaCheckCircle />
              </button>
              <button
                onClick={() => handleReject(selectedRider._id)}
                className="bg-[#EF4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-lg w-1/2 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
              >
                <FaTimesCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
