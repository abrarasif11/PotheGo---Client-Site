import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import riderImg from "../../assets/banner/-1.png";
import { useLoaderData } from "react-router-dom";

const BeARider = () => {
  const serviceCenter = useLoaderData(); // [{ region: "Dhaka", district: "Mirpur" }, ...]
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");

  // Extract unique regions
  useEffect(() => {
    if (serviceCenter?.length) {
      const uniqueRegions = [
        ...new Set(serviceCenter.map((center) => center.region)),
      ];
      setRegions(uniqueRegions);
    }
  }, [serviceCenter]);

  // Update districts when region changes
  useEffect(() => {
    if (selectedRegion) {
      const filtered = serviceCenter
        .filter((center) => center.region === selectedRegion)
        .map((center) => center.district);
      setDistricts(filtered);
    } else {
      setDistricts([]);
    }
  }, [selectedRegion, serviceCenter]);

  const onSubmit = (data) => {
    console.log("Rider Application:", data);
    reset();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-sm p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Be a Rider</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Send anything, anywhere quickly and reliably. Enjoy real-time
            tracking and a hassle-free delivery experience, every time.
          </p>
          <hr className="mt-8 border-gray-200" />
        </div>

        {/* Form and Illustration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tell us about yourself
            </h2>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your Name"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Age
                </label>
                <input
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Must be at least 18" },
                  })}
                  placeholder="Your age"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.age
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Your Email"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Region
                </label>
                <select
                  {...register("region", { required: "Region is required" })}
                  className={`w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 ${
                    errors.region
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                >
                  <option value="">Select your region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.region.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NID */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  NID No
                </label>
                <input
                  type="text"
                  {...register("nid", { required: "NID is required" })}
                  placeholder="NID"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.nid
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                />
                {errors.nid && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nid.message}
                  </p>
                )}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  {...register("contact", { required: "Contact is required" })}
                  placeholder="Contact"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.contact
                      ? "border-red-500 "
                      : "border-gray-300 "
                  }`}
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Which warehouse you want to work?
              </label>
              <select
                {...register("warehouse", {
                  required: "Please select a warehouse",
                })}
                disabled={!districts.length}
                className={`w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 ${
                  errors.warehouse
                    ? "border-red-500 "
                    : "border-gray-300 "
                }`}
              >
                <option value="">
                  {districts.length
                    ? "Select warehouse"
                    : "Select region first"}
                </option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.warehouse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.warehouse.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white bg-[#FA2A3B] hover:bg-[#E02032] rounded-lg py-2 font-semibold"
            >
              Submit
            </button>
          </form>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={riderImg}
              alt="Rider Illustration"
              className="w-72 md:w-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
