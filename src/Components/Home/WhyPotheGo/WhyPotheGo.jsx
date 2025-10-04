import React from "react";
import Lottie from "lottie-react";

// Import your Lottie JSON files (download from LottieFiles)
import trackingAnimation from "../../../assets/assests/GPS Location Animation.json";
import deliveryAnimation from "../../../assets/assests/Yellow delivery guy.json";
import safeAnimation from "../../../assets/assests/Receive order.json";

const WhyPotheGo = () => {
  const features = [
    {
      title: "Real-time tracking",
      description:
        "Keep tabs on your order from pick-up to drop-off. Input your details and we'll do the rest.",
      animation: trackingAnimation,
    },
    {
      title: "Fast delivery",
      description:
        "Need to send a parcel fast? No prob! We'll pick it up and deliver it safely within 1 hour.",
      animation: deliveryAnimation,
    },
    {
      title: "Safe and reliable",
      description:
        "With Pothego’s reliable rider network, your deliveries are safe, fast and stress-free.",
      animation: safeAnimation,
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Why PotheGo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-45 h-45 mb-4">
                <Lottie animationData={feature.animation} loop={true} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPotheGo;
