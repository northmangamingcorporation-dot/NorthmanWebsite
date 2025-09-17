import React from "react";
import ReactDOM from "react-dom/client";
import "../css/index.css"; // fixed path
import NorthmanGamingSite from "./App"; // make sure App.jsx exists here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NorthmanGamingSite />
  </React.StrictMode>
);
