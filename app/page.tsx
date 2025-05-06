import React from "react";
import Slider from "./components/Main-Page/Slider";
import LatestNews from "./components/Main-Page/LatestNews";
import Expert from "./components/Main-Page/Expert";
import Category from "./components/Category";

export default function page() {
  return (
    <div>
      <Slider />
      <Category />
      <LatestNews />
      <Expert />
    </div>
  );
}
