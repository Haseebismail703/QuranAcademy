import React from "react";
import Hero from "../../Components/HomeComponent/Hero";
import HomeNavbar from "../../Components/HomeComponent/Navbar";
import Footer from "../../Components/HomeComponent/Footer";

const Contact = () => {
  return (
    <>
    <HomeNavbar/>
      <Hero title="Contact Us" backgroundImage="/IMG-20250422-WA0086.jpg" />

      <div className="max-w-7xl mx-auto px-4 py-10 md:px-16 lg:px-20 ">
        <h2 className="text-3xl  text-gray-800 mb-4">CONTACT DETAILS</h2>

        <div className="flex flex-col md:flex-row gap-6">

          <div className="flex-1 bg-gray-100 rounded-lg p-6 border border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">Email:</p>
            <p className="text-gray-600">info@quraniacademy.com</p>
          </div>

          <div className="flex-1 bg-gray-100 rounded-lg p-6 border border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">Phone:</p>
            <p className="text-gray-600">+44 7477 487302</p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Contact;