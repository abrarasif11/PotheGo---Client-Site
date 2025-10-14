import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white overflow-hidden relative">
      {/* Sliding Parcel */}
      <div className="absolute top-1/3 w-full flex justify-center">
        <div className="relative animate-slideParcel">
          <FaBoxOpen className="text-[#FA2A3B] text-6xl drop-shadow-lg transform rotate-6" />
          {/* Soft parcel shadow */}
          <div className="absolute w-10 h-2 bg-gray-300 opacity-50 blur-sm bottom-[-10px] left-1/2 transform -translate-x-1/2 rounded-full"></div>
        </div>
      </div>

      {/* Floating mini parcels */}
      <div className="flex space-x-4 mt-36">
        <div className="w-6 h-6 bg-[#FA2A3B] rounded-md shadow-lg animate-bounceParcel"></div>
        <div className="w-6 h-6 bg-[#E02032] rounded-md shadow-lg animate-bounceParcel animation-delay-200"></div>
        <div className="w-6 h-6 bg-[#FA2A3B] rounded-md shadow-lg animate-bounceParcel animation-delay-400"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-[#FA2A3B] font-semibold text-lg tracking-wide">
        Processing Your Parcel...
      </p>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideParcel {
          0% {
            transform: translateX(-120%) rotate(-5deg);
          }
          25% {
            transform: translateX(-40%) rotate(2deg);
          }
          50% {
            transform: translateX(20%) rotate(-3deg);
          }
          75% {
            transform: translateX(60%) rotate(3deg);
          }
          100% {
            transform: translateX(120%) rotate(-5deg);
          }
        }

        @keyframes bounceParcel {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-slideParcel {
          animation: slideParcel 4s ease-in-out infinite;
        }

        .animate-bounceParcel {
          animation: bounceParcel 0.8s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Loader;
