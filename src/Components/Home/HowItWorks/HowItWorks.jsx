// src/components/ServiceSection.jsx
import React, { useState } from "react";
import Lottie from "lottie-react";

/*
  Replace these with the actual paths to your JSON animation files
*/
import TrustService from "../../../assets/assests/high five.json";
import Step1 from "../../../assets/assests/Computer guy sitting at a computer.json";
import Step2 from "../../../assets/assests/Package delivery.json";
import Step3 from "../../../assets/assests/Delivery.json";

const HowItWorks = () => {
  const [step, setStep] = useState(1);

  const stepAnimations = {
    1: Step1,
    2: Step2,
    3: Step3,
  };

  return (
    <section className="max-w-7xl mx-auto mb-20">
      {/* A service you can trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A service you can trust
          </h2>
          <p className="text-gray-600 max-w-xl">
            PotheGo is an intelligent parcel booking, tracking, and delivery
            platform, designed to ensure fast, reliable and hassle-free
            deliveries powered by smart technology.
          </p>
        </div>

        <div className="order-1 md:order-2 flex justify-end">
          <div className="w-90 h-90">
            <Lottie animationData={TrustService} loop={true} />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="" />

      {/* How does it work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: animation changes by step */}
        <div className="flex justify-center">
          <div className="w-90 h-90">
            <Lottie animationData={stepAnimations[step]} loop={true} />
          </div>
        </div>

        {/* Right: steps */}
        <div>
          <h3 className="text-2xl font-bold mb-6">How does it work?</h3>

          {[
            {
              id: 1,
              title: "Enter your parcel details",
              desc: "Set your pick-up and drop-off locations, and add any special instructions for a smooth delivery.",
            },
            {
              id: 2,
              title: "Wait for pickup confirmation",
              desc: "Once your request is confirmed, a courier will be assigned to pick up your parcel.",
            },
            {
              id: 3,
              title: "Track your delivery in real time",
              desc: "Follow your parcel’s journey live or share tracking details with your customer for full transparency.",
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
                    ? "bg-[#FA2A3B] text-white"
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
