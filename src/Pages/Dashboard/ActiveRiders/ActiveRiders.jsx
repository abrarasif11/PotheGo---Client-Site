import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaUserSlash, FaSearch, FaUserCheck } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: riders = [], refetch } = useQuery({
    queryKey: ["activeRiders", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `riders/active${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      return res.data;
    },
  });

  const handleDeactivate = async (riderId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`riders/${riderId}`, { status: "Inactive" });
        Swal.fire("Success!", "Rider deactivated successfully.", "success");
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
    <div className="p-6 bg-gradient-to-br from-white to-[#fff5f5] min-h-screen">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-10 text-center text-[#FA2A3B]">
          <FaUserCheck className="text-[#E02032]" /> Active Riders
        </h1>
      </div>

      {/* Search */}
      <div className="mb-4 relative w-full max-w-sm mx-auto md:mx-0">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {riders.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          No active riders found.
        </p>
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
                  <th className="px-4 py-3 text-left">Warehouse</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, index) => (
                  <tr
                    key={rider._id}
                    className={`transition-all duration-200 hover:bg-[#fff2f3] ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
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
                    <td className="px-4 py-3 capitalize ">
                      {rider.status || "Active"}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleDeactivate(rider._id)}
                        className="bg-red-500 text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                        title="Deactivate"
                      >
                        <FaUserSlash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
            {riders.map((rider) => (
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#FA2A3B]">
                    {rider.name}
                  </h3>
                  <span className="text-xs text-gray-500 capitalize">
                    {rider.status || "Active"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rider.email}</p>
                <p className="text-sm text-gray-600">{rider.contact || "-"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Warehouse: {rider.warehouse} | Region: {rider.region}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Created:{" "}
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
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleDeactivate(rider._id)}
                    className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:scale-105 transition-transform flex items-center justify-center"
                  >
                    <FaUserSlash />
                    <span className="pl-1 hidden sm:inline">Deactivate</span>
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
                <strong>Status:</strong> {selectedRider.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
