import React, { useState, useMemo } from "react";
import { useLoaderData } from "react-router-dom";

const SendParcel = () => {
  const serviceCenter = useLoaderData() || [];

  const [parcelType, setParcelType] = useState("document");

  //  Sender states
  const [senderName, setSenderName] = useState("");
  const [senderRegion, setSenderRegion] = useState("");
  const [senderDistrict, setSenderDistrict] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [pickupInstruction, setPickupInstruction] = useState("");

  //  Receiver states
  const [receiverName, setReceiverName] = useState("");
  const [receiverRegion, setReceiverRegion] = useState("");
  const [receiverDistrict, setReceiverDistrict] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverContact, setReceiverContact] = useState("");
  const [deliveryInstruction, setDeliveryInstruction] = useState("");

  //  Parcel basic info
  const [parcelName, setParcelName] = useState("");
  const [parcelWeight, setParcelWeight] = useState("");

  //  Get unique regions
  const regions = useMemo(
    () =>
      Array.from(new Set(serviceCenter.map((s) => s.region).filter(Boolean))),
    [serviceCenter]
  );

  //  Filter districts by selected region
  const getDistrictsByRegion = (region) =>
    serviceCenter
      .filter((s) => s.region === region)
      .map((s) => s.district)
      .filter((v, i, a) => v && a.indexOf(v) === i);

  // --- HANDLE SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      parcelType,
      parcelName,
      parcelWeight,
      sender: {
        name: senderName,
        region: senderRegion,
        district: senderDistrict,
        address: senderAddress,
        contact: senderContact,
        pickupInstruction,
      },
      receiver: {
        name: receiverName,
        region: receiverRegion,
        district: receiverDistrict,
        address: receiverAddress,
        contact: receiverContact,
        deliveryInstruction,
      },
    };
    console.log("submit payload:", payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-10"
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Add Parcel
        </h2>
        <hr className="border-gray-200 my-4" />

        {/* --- Parcel Type --- */}
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
              className="text-green-600 "
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
              className="text-green-600 "
            />
            <span className="text-gray-700">Not-Document</span>
          </label>
        </div>

        {/* --- Parcel Basic Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Name
            </label>
            <input
              value={parcelName}
              onChange={(e) => setParcelName(e.target.value)}
              type="text"
              placeholder="Parcel Name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Weight (KG)
            </label>
            <input
              value={parcelWeight}
              onChange={(e) => setParcelWeight(e.target.value)}
              type="number"
              placeholder="Parcel Weight (KG)"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 "
            />
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* --- Sender & Receiver Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* --- Sender --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sender Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sender Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Name
                </label>
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  type="text"
                  placeholder="Sender Name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Select Region */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Your Region
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={senderRegion}
                  onChange={(e) => {
                    setSenderRegion(e.target.value);
                    setSenderDistrict("");
                  }}
                >
                  <option value="">Select Your Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sender Pickup Warehouse (district by region) */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Pickup Warehouse
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={senderDistrict}
                  onChange={(e) => setSenderDistrict(e.target.value)}
                  disabled={!senderRegion}
                >
                  <option value="">
                    {senderRegion
                      ? "Select Warehouse (District)"
                      : "Select Region First"}
                  </option>
                  {senderRegion &&
                    getDistrictsByRegion(senderRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sender Address */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Address
                </label>
                <input
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Sender Contact */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Contact No
                </label>
                <input
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  type="text"
                  placeholder="Sender Contact No"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Pickup Instruction */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Pickup Instruction
                </label>
                <textarea
                  value={pickupInstruction}
                  onChange={(e) => setPickupInstruction(e.target.value)}
                  placeholder="Pickup Instruction"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* --- Receiver --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Receiver Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receiver Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Name
                </label>
                <input
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  type="text"
                  placeholder="Receiver Name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Receiver Region */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Region
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={receiverRegion}
                  onChange={(e) => {
                    setReceiverRegion(e.target.value);
                    setReceiverDistrict("");
                  }}
                >
                  <option value="">Select Receiver Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiver District by Region */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Warehouse (District)
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={receiverDistrict}
                  onChange={(e) => setReceiverDistrict(e.target.value)}
                  disabled={!receiverRegion}
                >
                  <option value="">
                    {receiverRegion ? "Select District" : "Select Region First"}
                  </option>
                  {receiverRegion &&
                    getDistrictsByRegion(receiverRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              {/* Receiver Address */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Address
                </label>
                <input
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Receiver Contact */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Contact No
                </label>
                <input
                  value={receiverContact}
                  onChange={(e) => setReceiverContact(e.target.value)}
                  type="text"
                  placeholder="Receiver Contact No"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Delivery Instruction */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Delivery Instruction
                </label>
                <textarea
                  value={deliveryInstruction}
                  onChange={(e) => setDeliveryInstruction(e.target.value)}
                  placeholder="Delivery Instruction"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          * PickUp Time 4pm-7pm Approx.
        </p>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-[#FA2A3B] text-white font-medium py-2 px-6 rounded-md hover:bg-[#E02032] transition"
          >
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
