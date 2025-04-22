import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center md:flex-row relative px-4 md:px-16">
  <div
    className="absolute top-0 left-0 right-0 bottom-0 md:hidden"
    style={{
      backgroundImage: `url('/IMG-20250422-WA0089.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      filter: "brightness(0.5) contrast(1.1)",
      zIndex: 0,
    }}
  />
  
  <div className="md:w-1/2 z-10 h-[600px] flex items-center justify-center p-8 order-2 md:order-1 rounded-lg my-8">
    <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[#003E3B] hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
          />
        </div>

        <button className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transition-all duration-300">
          Sign Up
        </button>
      </div>
    </div>
  </div>

  <div className="hidden md:flex md:w-1/2 h-[600px] items-center justify-center order-1 md:order-2">
  <div
    className="relative rounded-2xl w-full h-full flex items-center justify-center p-12 text-center text-white"
    style={{
      backgroundImage: `url('/IMG-20250422-WA0089.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      filter: "brightness(0.8) contrast(1.1) grayscale(0.2)",
      minHeight: "100%",
    }}
  >
    <div className="relative z-10 max-w-md text-white">
      <h1 className="text-3xl font-semibold mb-4 leading-relaxed text-black">
        إِنَّ مَعَ الْعُسْرِ يُسْرًا
      </h1>
      <p className="text-lg text-black opacity-90">
        "Indeed, with hardship [will be] ease." <br />
        <span className="text-sm text-black">— Surah Ash-Sharh (94:6)</span>
      </p>
    </div>
  </div>
</div>

</div>

  );
};

export default Register;