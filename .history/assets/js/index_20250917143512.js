import React from "react";
import ReactDOM from "react-dom/client";
import "/index.css"; // Tailwind should be imported here
import NorthmanGamingSite from "./App"; // or wherever you saved it

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NorthmanGamingSite />
  </React.StrictMode>
);
