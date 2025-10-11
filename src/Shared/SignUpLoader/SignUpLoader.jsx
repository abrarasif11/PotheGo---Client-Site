import React from "react";
import { FaUserPlus } from "react-icons/fa";

const SignupLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-20 h-20">
        {/* Spinning outer ring */}
        <div className="absolute inset-0 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>

        {/* User-plus icon with subtle bounce */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FaUserPlus className="text-red-500 w-10 h-10 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default SignupLoader;
