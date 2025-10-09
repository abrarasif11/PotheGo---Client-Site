import React from "react";
import riderImg from "../../assets/banner/-1.png";

const BeARider = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-sm p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Be a Rider</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
          <hr className="mt-8 border-gray-200" />
        </div>

        {/* Form and Illustration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Form Section */}
          <form className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tell us about yourself
            </h2>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Age
                </label>
                <input
                  type="number"
                  placeholder="Your age"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Region
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-400">
                  <option>Select your region</option>
                  <option>Dhaka</option>
                  <option>Chittagong</option>
                  <option>Khulna</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  NID No
                </label>
                <input
                  type="text"
                  placeholder="NID"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  placeholder="Contact"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Which warehouse you want to work?
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-400">
                <option>Select warehouse</option>
                <option>Dhaka</option>
                <option>Chandpur</option>
                <option>Barisal</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-lime-300 hover:bg-lime-400 transition font-semibold text-gray-800 rounded-lg py-2"
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
