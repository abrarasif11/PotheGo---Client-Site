// PageError.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruckMoving, FaBoxOpen } from "react-icons/fa";

const PageError = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white overflow-hidden">
      {/* Animated Road */}
      <div className="absolute bottom-0 w-full h-20 bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[200%] h-1 bg-gray-400 animate-roadLine"></div>
        </div>
      </div>

      {/* Moving Truck */}
      <div className="absolute bottom-16 left-[-120px] animate-drive">
        <div className="relative w-32 h-20">
          {/* Truck body */}
          <div className="absolute bottom-0 left-0 w-24 h-12 bg-[#FA2A3B] rounded-lg shadow-lg"></div>
          {/* Truck cabin */}
          <div className="absolute bottom-2 left-20 w-10 h-8 bg-[#E02032] rounded-md shadow-md"></div>
          {/* Wheels */}
          <div className="absolute bottom-0 left-2 w-4 h-4 bg-white rounded-full border-2 border-gray-700 animate-spinWheel"></div>
          <div className="absolute bottom-0 left-16 w-4 h-4 bg-white rounded-full border-2 border-gray-700 animate-spinWheel"></div>
        </div>
      </div>

      {/* Falling Parcel */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 animate-dropParcel">
        <FaBoxOpen className="text-[#FA2A3B] text-5xl drop-shadow-lg" />
      </div>

      {/* 404 Text */}
      <h1 className="text-7xl font-extrabold text-[#FA2A3B] animate-glow">
        404
      </h1>
      <p className="mt-3 text-gray-700 text-lg font-medium">
        Oops! This delivery route couldn’t be found.
      </p>

      {/* Truck Icon */}
      <div className="flex items-center justify-center mt-5 text-[#FA2A3B] text-4xl animate-bounce-slow">
        <FaTruckMoving />
      </div>

      {/* Back Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-[#FA2A3B] hover:bg-[#E02032] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
      >
        Back to Home
      </button>

      {/* Animations */}
      <style jsx>{`
        @keyframes spinWheel {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes drive {
          0% {
            transform: translateX(-150px);
          }
          50% {
            transform: translateX(60vw);
          }
          100% {
            transform: translateX(120vw);
          }
        }
        @keyframes roadLine {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes dropParcel {
          0% {
            transform: translate(-50%, -200px) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            transform: translate(-50%, 20px) rotate(30deg);
          }
          100% {
            transform: translate(-50%, 60px) rotate(45deg);
            opacity: 0;
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 10px #fa2a3b, 0 0 20px #fa2a3b;
          }
          50% {
            text-shadow: 0 0 20px #e02032, 0 0 40px #e02032;
          }
        }
        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-spinWheel {
          animation: spinWheel 0.6s linear infinite;
        }
        .animate-drive {
          animation: drive 5s linear infinite;
        }
        .animate-roadLine {
          animation: roadLine 1.5s linear infinite;
          background-image: repeating-linear-gradient(
            to right,
            #a3a3a3 0,
            #a3a3a3 40px,
            transparent 40px,
            transparent 80px
          );
        }
        .animate-dropParcel {
          animation: dropParcel 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounceSlow 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageError;
