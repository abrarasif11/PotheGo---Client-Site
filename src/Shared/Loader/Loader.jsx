import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  const pathVariants = {
    animate: {
      x: ["0%", "100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100">
      <div className="w-3/4 h-2 bg-gray-300 rounded-full relative overflow-hidden">
        <motion.div
          className="w-8 h-8 bg-blue-500 rounded-full absolute top-[-0.75rem]"
          variants={pathVariants}
          animate="animate"
        />
      </div>
      <p className="mt-4 text-gray-700 font-semibold animate-pulse">
        Tracking your order...
      </p>
    </div>
  );
};

export default Loader;
