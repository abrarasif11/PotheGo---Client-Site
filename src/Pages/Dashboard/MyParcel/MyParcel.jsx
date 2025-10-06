import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaTrashAlt, FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // SweetAlert2 custom style
  const swalWithCustomStyle = Swal.mixin({
    confirmButtonColor: "#FA2A3B",
    cancelButtonColor: "#6b7280",
  });

  // View Details
  const handleView = (parcel) => {
    swalWithCustomStyle.fire({
      title: `<b>${parcel.parcelName}</b>`,
      html: `
        <div style="text-align:left;">
          <p><b>Tracking ID:</b> ${parcel.trackingId}</p>
          <p><b>Type:</b> ${parcel.parcelType}</p>
          <p><b>Price:</b> ৳${parcel.price}</p>
          <p><b>Status:</b> ${parcel.status}</p>
          <p><b>Sender:</b> ${parcel.senderName}</p>
          <p><b>Receiver:</b> ${parcel.receiverName}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  
  const handlePay = (parcel) => {
    swalWithCustomStyle
      .fire({
        title: "Confirm Payment",
        text: `Pay ৳${parcel.price} for ${parcel.parcelName}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Pay Now",
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithCustomStyle.fire(
            "Payment Successful!",
            "Status updated to Paid.",
            "success"
          );
        }
      });
  };

  const handleDelete = (id) => {
    swalWithCustomStyle
      .fire({
        title: "Are you sure?",
        text: "This parcel will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axiosSecure.delete(`/parcels/${id}`);

            if (res.status === 200 || res.data?.deletedCount > 0) {
              await swalWithCustomStyle.fire(
                "Deleted!",
                "Parcel has been successfully deleted.",
                "success"
              );
              refetch();
            } else {
              swalWithCustomStyle.fire(
                "Error!",
                "Failed to delete parcel. Try again later.",
                "error"
              );
            }
          } catch (error) {
            console.error("Delete error:", error);
            swalWithCustomStyle.fire(
              "Error!",
              "Server error occurred during deletion.",
              "error"
            );
          }
        }
      });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#FA2A3B]"></span>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#FA2A3B] text-center sm:text-left">
        My Parcels
      </h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="table w-full text-sm sm:text-base">
          <thead className="bg-[#FA2A3B]/10 text-gray-700 uppercase text-xs sm:text-sm">
            <tr>
              <th>#</th>
              <th>Parcel Name</th>
              <th>Type</th>
              <th className="hidden sm:table-cell">Tracking ID</th>
              <th>Price</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Created At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No parcels found.
                </td>
              </tr>
            ) : (
              parcels.map((parcel, index) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-[#FA2A3B]/5 transition duration-150"
                >
                  <td className="font-medium text-gray-700">{index + 1}</td>
                  <td className="font-semibold break-words">
                    {parcel.parcelName}
                  </td>
                  <td>
                    <span className="text-black text-xs sm:text-sm">
                      {parcel.parcelType}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell text-gray-600 text-xs sm:text-sm">
                    {parcel.trackingId}
                  </td>
                  <td className="font-semibold text-gray-800">
                    ৳ {parcel.price}
                  </td>
                  <td>
                    <span
                      className={`badge text-white text-xs sm:text-sm ${
                        parcel.status === "Paid"
                          ? "bg-green-500"
                          : "bg-[#FA2A3B]"
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell text-gray-500 text-xs">
                    {new Date(parcel.createdAt).toLocaleDateString()}
                  </td>
                  <td className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleView(parcel)}
                      className="btn btn-xs sm:btn-sm text-white bg-[#FA2A3B] border-none hover:bg-[#e12532]"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handlePay(parcel)}
                      className="btn btn-xs sm:btn-sm text-white bg-[#FA2A3B] border-none hover:bg-[#e12532]"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-xs sm:btn-sm text-white bg-[#FA2A3B] border-none hover:bg-[#e12532]"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcel;
