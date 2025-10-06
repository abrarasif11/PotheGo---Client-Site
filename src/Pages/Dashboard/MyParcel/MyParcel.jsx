import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaTrashAlt, FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // View Details
  const handleView = (parcel) => {
    Swal.fire({
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
      confirmButtonColor: "#FA2A3B",
    });
  };

  // Handle Payment
  const handlePay = (parcel) => {
    Swal.fire({
      title: "Confirm Payment",
      text: `Pay ৳${parcel.price} for ${parcel.parcelName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate payment success
        Swal.fire("Payment Successful!", "Status updated to Paid.", "success");
        // If backend supports update:
        // axiosSecure.patch(`/parcels/${parcel._id}`, { status: "Paid" }).then(() => refetch());
      }
    });
  };

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/parcels/${id}`);
          Swal.fire("Deleted!", "Parcel removed successfully.", "success");
          refetch();
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "Failed to delete parcel.", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📦 My Parcels ({parcels.length})
      </h2>

      <div className="overflow-x-auto shadow-xl rounded-2xl border border-gray-200">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th>#</th>
              <th>Parcel Name</th>
              <th>Type</th>
              <th>Tracking ID</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created At</th>
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
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="font-medium text-gray-700">{index + 1}</td>
                  <td className="font-semibold">{parcel.parcelName}</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.parcelType === "Document"
                          ? " text-black"
                          : " text-black"
                      }`}
                    >
                      {parcel.parcelType}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">{parcel.trackingId}</td>
                  <td className="font-semibold text-gray-800">
                    ৳ {parcel.price}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.status === "Paid"
                          ? "badge-success text-white"
                          : "badge-warning text-white"
                      }`}
                    >
                      {parcel.status === "Paid" ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(parcel.createdAt).toLocaleString()}
                  </td>
                  <td className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleView(parcel)}
                      className="btn btn-sm btn-info text-white"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handlePay(parcel)}
                      className="btn btn-sm btn-success text-white"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-sm btn-error text-white"
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
