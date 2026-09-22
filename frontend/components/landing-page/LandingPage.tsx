"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import WhyIBuilt from "./WhyIBuilt";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import WhatILearned from './WhatILearned';
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#F7F7F5] text-neutral-900">
      <Navbar />
      <Hero />
      <WhyIBuilt />
      <Features />
      <HowItWorks />
      <WhatILearned />
      <FinalCTA />
      <Footer />
    </main>
  );
}