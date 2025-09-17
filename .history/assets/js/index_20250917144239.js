// assets/js/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import NorthmanGamingSite from "./pages/App.jsx"; // or wherever you saved it

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NorthmanGamingSite />
  </React.StrictMode>
);
