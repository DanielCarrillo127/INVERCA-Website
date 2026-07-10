import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Services from "./Services";
import Stats from "./Stats";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="app">
      <Nav />
      <Hero />
      <Services />
      <Stats />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Home;
