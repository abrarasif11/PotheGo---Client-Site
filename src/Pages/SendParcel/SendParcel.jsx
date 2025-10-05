import React, { useState } from "react";
// import { useLoaderData } from "react-router-dom";

const SendParcel = () => {
  // const serviceCenter = useLoaderData() || [];
  const [parcelType, setParcelType] = useState("document");

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-10">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Add Parcel
        </h2>
        <hr className="border-gray-200 my-4" />

        {/* Parcel Type */}
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Enter your parcel details
        </p>

        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="parcelType"
              value="document"
              checked={parcelType === "document"}
              onChange={() => setParcelType("document")}
              className="text-green-600 focus:ring-[#E02032]"
            />
            <span className="text-gray-700">Document</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="parcelType"
              value="non-document"
              checked={parcelType === "non-document"}
              onChange={() => setParcelType("non-document")}
              className="text-green-600 focus:ring-[#E02032]"
            />
            <span className="text-gray-700">Not-Document</span>
          </label>
        </div>

        {/* Parcel Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Name
            </label>
            <input
              type="text"
              placeholder="Parcel Name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#E02032]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Weight (KG)
            </label>
            <input
              type="number"
              placeholder="Parcel Weight (KG)"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#E02032]"
            />
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* Sender & Receiver Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sender Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sender Name"
                className="border border-gray-300 rounded-md p-2"
              />
              <select className="border border-gray-300 rounded-md p-2">
                <option>Select Wire house</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Sender Contact No"
                className="border border-gray-300 rounded-md p-2"
              />
              <select className="border border-gray-300 rounded-md p-2 col-span-2">
                <option>Select your region</option>
              </select>
              <textarea
                placeholder="Pickup Instruction"
                rows="3"
                className="border border-gray-300 rounded-md p-2 col-span-2"
              ></textarea>
            </div>
          </div>

          {/* Receiver Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Receiver Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Receiver Name"
                className="border border-gray-300 rounded-md p-2"
              />
              <select className="border border-gray-300 rounded-md p-2">
                <option>Select Wire house</option>
              </select>
              <input
                type="text"
                placeholder="Receiver Address"
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Receiver Contact No"
                className="border border-gray-300 rounded-md p-2"
              />
              <select className="border border-gray-300 rounded-md p-2 col-span-2">
                <option>Select your region</option>
              </select>
              <textarea
                placeholder="Delivery Instruction"
                rows="3"
                className="border border-gray-300 rounded-md p-2 col-span-2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 mt-8">
          * PickUp Time 4pm-7pm Approx.
        </p>

        {/* Button */}
        <div className="mt-6">
          <button className="bg-lime-400 text-gray-900 font-medium py-2 px-6 rounded-md hover:bg-lime-500 transition">
            Proceed to Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
