import React from "react";
import delivery from "../../../assets/assests/Delivery guy.json";
import payment from "../../../assets/assests/Payment Successful Animation.json";
import Lottie from "lottie-react";
const PricingSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left text */}
        <div>
          <h2 className="text-3xl font-bold leading-snug mb-4">
            Pay as you go <br /> No contract required
          </h2>
          <p className="text-gray-600 text-lg">
            No hidden fees, no long-term contracts. With Pothego, you pay per
            parcel – simple as that.
          </p>
        </div>

        {/* Right image */}
        <div className="flex justify-center">
          <div className="w-90 h-90 mb-4">
            <Lottie animationData={payment} loop={true} />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left image */}
        <div className="flex justify-center">
          <div className="w-90 h-90 mb-4">
            <Lottie animationData={delivery} loop={true} />
          </div>
        </div>

        {/* Right text */}
        <div>
          <h2 className="text-3xl font-bold mb-4">All you need, delivered</h2>
          <p className="text-gray-600 text-lg">
            From snacks to shopping, our platform helps connect businesses,
            customers and couriers — so your items arrive quickly and
            conveniently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
