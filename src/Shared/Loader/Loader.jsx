import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white overflow-hidden relative">
      {/* Sliding Truck */}
      <div className="absolute top-1/3 w-full">
        <div className="relative w-32 h-20 animate-slideTruck">
          {/* Truck body */}
          <div className="absolute bottom-0 left-0 w-24 h-12 bg-[#FA2A3B] rounded-lg shadow-lg"></div>
          {/* Truck wheels */}
          <div className="absolute bottom-0 left-1 w-4 h-4 bg-white rounded-full shadow-inner animate-spinWheel"></div>
          <div className="absolute bottom-0 left-14 w-4 h-4 bg-white rounded-full shadow-inner animate-spinWheel"></div>
        </div>
      </div>

      {/* Bouncing parcels */}
      <div className="flex space-x-4 mt-36">
        <div className="w-6 h-6 bg-[#FA2A3B] rounded shadow-lg animate-bounceParcel"></div>
        <div className="w-6 h-6 bg-[#E02032] rounded shadow-lg animate-bounceParcel animation-delay-200"></div>
        <div className="w-6 h-6 bg-[#FA2A3B] rounded shadow-lg animate-bounceParcel animation-delay-400"></div>
      </div>

      <p className="mt-6 text-[#FA2A3B] font-semibold">
        Processing Your Parcel...
      </p>

      {/* Inline CSS for animations */}
      <style jsx>{`
        @keyframes slideTruck {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spinWheel {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
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

        .animate-slideTruck {
          animation: slideTruck 4s linear infinite;
        }
        .animate-spinWheel {
          animation: spinWheel 0.6s linear infinite;
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
