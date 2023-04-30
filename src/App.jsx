import React from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import "./App.css";
import Skills from "./Components/Skills";
import Social from "./Components/Social";
import About from "./Components/About";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Social />
      <Footer />
    </div>
  );
};

export default App;
