// assets/js/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import NorthmanGamingSite from ".app.js"; // or wherever you saved it

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NorthmanGamingSite />
  </React.StrictMode>
);

export default function NorthmanGamingSite() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-teal-600">Northman Gaming</h1>
        <ul className="flex space-x-6 font-medium">
          <li><a href="#home" className="hover:text-teal-600">Home</a></li>
          <li><a href="#services" className="hover:text-teal-600">Services</a></li>
          <li><a href="#about" className="hover:text-teal-600">About</a></li>
          <li><a href="#contact" className="hover:text-teal-600">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="text-center py-20 bg-gradient-to-r from-white to-teal-50">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to Northman Gaming Corporation
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Empowering clients with modern gaming solutions, esports partnerships, and digital entertainment services.
        </p>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition">
          Get Started
        </button>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-8 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-teal-600 mb-2">Gaming Solutions</h4>
            <p className="text-gray-600">Providing state-of-the-art platforms and tools for gamers and partners.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-teal-600 mb-2">Esports Partnerships</h4>
            <p className="text-gray-600">Collaborating with teams, events, and sponsors to elevate the esports experience.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-teal-600 mb-2">Client Support</h4>
            <p className="text-gray-600">Dedicated assistance and solutions tailored to your business and players.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-8 bg-gray-50 text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-900">About Us</h3>
        <p className="max-w-3xl mx-auto text-gray-600">
          Northman Gaming Corporation is committed to redefining the digital entertainment industry. With a focus on innovation, community, and growth, we deliver gaming experiences and solutions designed to empower our clients and captivate audiences worldwide.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-8 bg-white text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h3>
        <p className="text-gray-600 mb-8">Let’s build the future of gaming together.</p>
        <a href="mailto:info@northmangaming.com" className="px-6 py-3 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition">
          Email Us
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-100 text-gray-600">
        © {new Date().getFullYear()} Northman Gaming Corporation. All Rights Reserved.
      </footer>
    </div>
  );
}
