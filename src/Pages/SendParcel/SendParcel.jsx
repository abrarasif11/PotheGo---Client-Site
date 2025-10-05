import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";

const SendParcel = () => {
  const serviceCenter = useLoaderData() || [];
  const [parcelType, setParcelType] = useState("document");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelName: "",
      parcelWeight: "",
      senderName: "",
      senderRegion: "",
      senderDistrict: "",
      senderAddress: "",
      senderContact: "",
      pickupInstruction: "",
      receiverName: "",
      receiverRegion: "",
      receiverDistrict: "",
      receiverAddress: "",
      receiverContact: "",
      deliveryInstruction: "",
    },
  });

  const watchSenderRegion = watch("senderRegion");
  const watchReceiverRegion = watch("receiverRegion");

  // Get unique regions
  const regions = useMemo(
    () =>
      Array.from(new Set(serviceCenter.map((s) => s.region).filter(Boolean))),
    [serviceCenter]
  );

  const getDistrictsByRegion = (region) =>
    serviceCenter
      .filter((s) => s.region === region)
      .map((s) => s.district)
      .filter((v, i, a) => v && a.indexOf(v) === i);

  const onSubmit = (data) => {
    const payload = { parcelType, ...data };
    console.log("submit payload:", payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
          {["document", "non-document"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="parcelType"
                value={type}
                checked={parcelType === type}
                onChange={() => setParcelType(type)}
                className="text-green-600"
              />
              <span className="text-gray-700">
                {type === "document" ? "Document" : "Not-Document"}
              </span>
            </label>
          ))}
        </div>

        {/* --- Parcel Basic Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Name
            </label>
            <input
              {...register("parcelName", {
                required: "Parcel Name is required",
              })}
              type="text"
              placeholder="Parcel Name"
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.parcelName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.parcelName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parcelName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcel Weight (KG)
            </label>
            <input
              {...register("parcelWeight", {
                required: "Parcel Weight is required",
              })}
              type="number"
              placeholder="Parcel Weight (KG)"
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.parcelWeight ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.parcelWeight && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parcelWeight.message}
              </p>
            )}
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* --- Sender & Receiver Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sender Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Name
                </label>
                <input
                  {...register("senderName", {
                    required: "Sender Name is required",
                  })}
                  type="text"
                  placeholder="Sender Name"
                  className={`w-full border rounded-md p-2 ${
                    errors.senderName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm">
                    {errors.senderName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Your Region
                </label>
                <select
                  {...register("senderRegion", {
                    required: "Sender Region is required",
                  })}
                  onChange={(e) => {
                    setValue("senderRegion", e.target.value);
                    setValue("senderDistrict", ""); // reset district when region changes
                  }}
                  className={`w-full border rounded-md p-2 ${
                    errors.senderRegion ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Your Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <p className="text-red-500 text-sm">
                    {errors.senderRegion.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Pickup Warehouse
                </label>
                <select
                  {...register("senderDistrict", {
                    required: "Sender District is required",
                  })}
                  disabled={!watchSenderRegion}
                  className={`w-full border rounded-md p-2 ${
                    errors.senderDistrict ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {watchSenderRegion
                      ? "Select Warehouse (District)"
                      : "Select Region First"}
                  </option>
                  {watchSenderRegion &&
                    getDistrictsByRegion(watchSenderRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                {errors.senderDistrict && (
                  <p className="text-red-500 text-sm">
                    {errors.senderDistrict.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Address
                </label>
                <input
                  {...register("senderAddress", {
                    required: "Sender Address is required",
                  })}
                  type="text"
                  placeholder="Address"
                  className={`w-full border rounded-md p-2 ${
                    errors.senderAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.senderAddress.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sender Contact No
                </label>
                <input
                  {...register("senderContact", {
                    required: "Sender Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Invalid Contact Number",
                    },
                  })}
                  type="text"
                  placeholder="Sender Contact No"
                  className={`w-full border rounded-md p-2 ${
                    errors.senderContact ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.senderContact && (
                  <p className="text-red-500 text-sm">
                    {errors.senderContact.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Pickup Instruction
                </label>
                <textarea
                  {...register("pickupInstruction")}
                  placeholder="Pickup Instruction"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Receiver Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Name
                </label>
                <input
                  {...register("receiverName", {
                    required: "Receiver Name is required",
                  })}
                  type="text"
                  placeholder="Receiver Name"
                  className={`w-full border rounded-md p-2 ${
                    errors.receiverName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-sm">
                    {errors.receiverName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Region
                </label>
                <select
                  {...register("receiverRegion", {
                    required: "Receiver Region is required",
                  })}
                  onChange={(e) => {
                    setValue("receiverRegion", e.target.value);
                    setValue("receiverDistrict", "");
                  }}
                  className={`w-full border rounded-md p-2 ${
                    errors.receiverRegion ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Receiver Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <p className="text-red-500 text-sm">
                    {errors.receiverRegion.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Warehouse (District)
                </label>
                <select
                  {...register("receiverDistrict", {
                    required: "Receiver District is required",
                  })}
                  disabled={!watchReceiverRegion}
                  className={`w-full border rounded-md p-2 ${
                    errors.receiverDistrict
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {watchReceiverRegion
                      ? "Select District"
                      : "Select Region First"}
                  </option>
                  {watchReceiverRegion &&
                    getDistrictsByRegion(watchReceiverRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                {errors.receiverDistrict && (
                  <p className="text-red-500 text-sm">
                    {errors.receiverDistrict.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Address
                </label>
                <input
                  {...register("receiverAddress", {
                    required: "Receiver Address is required",
                  })}
                  type="text"
                  placeholder="Address"
                  className={`w-full border rounded-md p-2 ${
                    errors.receiverAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.receiverAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.receiverAddress.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Receiver Contact No
                </label>
                <input
                  {...register("receiverContact", {
                    required: "Receiver Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Invalid Contact Number",
                    },
                  })}
                  type="text"
                  placeholder="Receiver Contact No"
                  className={`w-full border rounded-md p-2 ${
                    errors.receiverContact
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.receiverContact && (
                  <p className="text-red-500 text-sm">
                    {errors.receiverContact.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Delivery Instruction
                </label>
                <textarea
                  {...register("deliveryInstruction")}
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
