import React from "react";
import Banner from "./Banner/Banner";
import WhyPotheGo from "./WhyPotheGo/WhyPotheGo";
import PricingSection from "./PricingSection/PricingSection";
import HowItWorks from "./HowItWorks/HowItWorks";
import FAQ from "./FAQ/FAQ";

const Home = () => {
  return (
    <div>
      <Banner />
      <WhyPotheGo />
      <PricingSection />
      <HowItWorks />
      <FAQ />
    </div>
  );
};

export default Home;
