import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from "date-fns";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/Loader/Loader";

const periods = ["Today", "Week", "Month", "Year", "Overall"];

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `rider/completed-parcels?email=${email}`
      );
      return res.data || [];
    },
  });

  const calculateEarning = (parcel) => {
    const price = Number(parcel.price) || 0;
    return parcel.sender_center === parcel.receiver_center
      ? price * 0.8
      : price * 0.3;
  };

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    earningsByPeriod = { Today: 0, Week: 0, Month: 0, Year: 0, Overall: 0 };

  parcels.forEach((p) => {
    const earning = calculateEarning(p);
    const deliveredAt = p.delivered_at ? new Date(p.delivered_at) : null;
    total += earning;
    if (p.cashout_status === "cashed_out") totalCashedOut += earning;
    else totalPending += earning;

    if (deliveredAt) {
      if (isAfter(deliveredAt, todayStart))
        earningsByPeriod["Today"] += earning;
      if (isAfter(deliveredAt, weekStart)) earningsByPeriod["Week"] += earning;
      if (isAfter(deliveredAt, monthStart))
        earningsByPeriod["Month"] += earning;
      if (isAfter(deliveredAt, yearStart)) earningsByPeriod["Year"] += earning;
    }
    earningsByPeriod["Overall"] += earning;
  });

  const [activePeriod, setActivePeriod] = useState("Today");

  const filteredParcels = parcels.filter((p) => {
    const deliveredAt = p.delivered_at ? new Date(p.delivered_at) : null;
    if (!deliveredAt) return false;

    switch (activePeriod) {
      case "Today":
        return isAfter(deliveredAt, todayStart);
      case "Week":
        return isAfter(deliveredAt, weekStart);
      case "Month":
        return isAfter(deliveredAt, monthStart);
      case "Year":
        return isAfter(deliveredAt, yearStart);
      default:
        return true;
    }
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-[#FA2A3B] text-center mb-4">
        My Earnings
      </h2>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FA2A3B]/10 border border-[#FA2A3B]/30 p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform">
              <p className="text-base font-medium text-gray-700">
                Total Earnings
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#FA2A3B] mt-1">
                ৳{total.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#E02032]/10 border border-[#E02032]/30 p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform">
              <p className="text-base font-medium text-gray-700">Cashed Out</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#E02032] mt-1">
                ৳{totalCashedOut.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 border border-yellow-200 p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform">
              <p className="text-base font-medium text-gray-700">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">
                ৳{totalPending.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Period Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-2 rounded-full font-semibold transition-all border ${
                  activePeriod === period
                    ? "bg-[#FA2A3B] text-white border-[#FA2A3B]"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Earnings Display */}
          <div className="mt-4 text-center bg-white border border-gray-200 p-5 rounded-2xl shadow-md">
            <p className="text-gray-600 text-sm sm:text-base">
              Earnings ({activePeriod})
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-[#FA2A3B] mt-1">
              ৳{earningsByPeriod[activePeriod]?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto mt-6 bg-white rounded-2xl border border-gray-200 shadow-md">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Parcel Name</th>
                  <th className="px-4 py-3 text-left">Delivered At</th>
                  <th className="px-4 py-3 text-left">Earning</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No earnings found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredParcels.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {p.parcelName || "Unnamed Parcel"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.delivered_at
                          ? new Date(p.delivered_at).toLocaleString("en-BD", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Not Delivered"}
                      </td>
                      <td className="px-4 py-3 text-[#FA2A3B] font-semibold">
                        ৳{calculateEarning(p).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            p.cashout_status === "cashed_out"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {(p.cashout_status || "Pending")
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEarnings;
