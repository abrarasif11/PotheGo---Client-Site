import React from "react";
import Banner from "./Banner/Banner";
import WhyPotheGo from "./WhyPotheGo/WhyPotheGo";
import PricingSection from "./PricingSection/PricingSection";
import HowItWorks from "./HowItWorks/HowItWorks";

const Home = () => {
  return (
    <div>
      <Banner />
      <WhyPotheGo />
      <PricingSection />
      <HowItWorks />
    </div>
  );
};

export default Home;
