import React from "react";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import ProductRow from "../components/home/ProductRow";
import TrustBadges from "../components/home/TrustBadges";
import CTABand from "../components/home/CTABand";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoryGrid />
      <ProductRow />
      <TrustBadges />
      <CTABand />
    </div>
  );
};

export default Home;
