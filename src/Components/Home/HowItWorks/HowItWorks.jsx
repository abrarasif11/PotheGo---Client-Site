// src/components/ServiceSection.jsx
import React, { useState } from "react";
import Lottie from "lottie-react";

/*
  Replace these with the actual paths to your JSON animation files
*/
import TrustService from "../../../assets/assests/high five.json";
import Step1 from "../../../assets/assests/GPS Location Animation.json";
import Step2 from "../../../assets/assests/Payment Successful Animation.json";
import Step3 from "../../../assets/assests/Yellow delivery guy.json";

const HowItWorks = () => {
  const [step, setStep] = useState(1);

  const stepAnimations = {
    1: Step1,
    2: Step2,
    3: Step3,
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* A service you can trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A service you can trust
          </h2>
          <p className="text-gray-600 max-w-xl">
            pandago is part of the foodpanda group, so you can rely on our large
            network of local couriers to provide the best last mile delivery
            service.
          </p>
        </div>

        <div className="order-1 md:order-2 flex justify-end">
          <div className="w-90 h-90">
            <Lottie animationData={TrustService} loop={true} />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="mt-12" />

      {/* How does it work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: animation changes by step */}
        <div className="flex justify-center">
          <div className="w-72 h-72">
            <Lottie animationData={stepAnimations[step]} loop={true} />
          </div>
        </div>

        {/* Right: steps */}
        <div>
          <h3 className="text-2xl font-bold mb-6">How does it work?</h3>

          {[
            {
              id: 1,
              title: "Input your order details",
              desc: "Set your pick-up and drop-off points. Any relevant details you'd like to share? Add 'em here!",
            },
            {
              id: 2,
              title: "Wait for your order to be picked up",
              desc: "After we confirm your request, a delivery will be created.",
            },
            {
              id: 3,
              title: "Track your delivery",
              desc: "Track your parcel or share its tracking details with your customer.",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-lg mb-4 transition ${
                step === item.id ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex-none w-9 h-9 rounded-full font-bold flex items-center justify-center ${
                  step === item.id
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.id}
              </div>

              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
