import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import { FaClock, FaHashtag } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white  text-black">
      <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-[#E02032]">
        Payment History
      </h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto hidden md:block">
          {/* Desktop Table */}
          <table className="table w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">
            <thead className="bg-gradient-to-r from-[#FA2A3B] to-[#E02032] text-white">
              <tr className="text-center">
                <th className="px-4 py-3 w-16 text-center">#</th>
                <th className="px-4 py-3 w-44 text-center">Parcel ID</th>
                <th className="px-4 py-3 w-32 text-center">Amount</th>
                <th className="px-4 py-3 w-[340px] text-center">
                  Transaction ID
                </th>
                <th className="px-4 py-3 w-56 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment._id}
                  className="hover:bg-[#fff2f3] transition-all duration-200 text-center align-middle"
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="font-semibold text-[#FA2A3B] py-3 break-all">
                    {payment.parcelId}
                  </td>
                  <td className="font-semibold text-[#22C55E] py-3">
                    {payment.amount}৳
                  </td>
                  <td className="text-sm text-gray-700 py-3 font-mono tracking-tight">
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                      <FaHashtag className="text-[#E02032]" />
                      {payment.transactionId}
                    </div>
                  </td>
                  <td className="text-sm text-gray-600 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <FaClock className="text-[#EAB308]" />
                      {new Date(payment.paid_at).toLocaleString("en-BD", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📱 Mobile View - Card Style */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {payments.map((payment, index) => (
          <div
            key={payment._id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#FA2A3B]">#{index + 1}</span>
              <span className="text-sm text-gray-500">
                <FaClock className="inline text-[#EAB308] mr-1" />
                {new Date(payment.paid_at).toLocaleDateString("en-BD", {
                  dateStyle: "medium",
                })}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600">Parcel ID:</span>{" "}
                <span className="text-[#FA2A3B]">{payment.parcelId}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Amount:</span>{" "}
                <span className="text-[#22C55E] font-semibold">
                  {payment.amount}৳
                </span>
              </p>
              <p className="break-all">
                <span className="font-medium text-gray-600">
                  Transaction ID:
                </span>{" "}
                <span className="text-gray-700 flex items-center gap-1 font-mono">
                  <FaHashtag className="text-[#E02032]" />
                  {payment.transactionId}
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Time:</span>{" "}
                {new Date(payment.paid_at).toLocaleTimeString("en-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
