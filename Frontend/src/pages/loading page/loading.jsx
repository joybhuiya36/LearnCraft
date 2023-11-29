import React from "react";
import "./loader.style.css";

const LoadingPage = () => {
  return (
    <div>
      <div class="loaderBG"></div>
      <div class="spinner">
        <div class="typewriter">
          <div class="slide">
            <i></i>
          </div>
          <div class="paper"></div>
          <div class="keyboard"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
