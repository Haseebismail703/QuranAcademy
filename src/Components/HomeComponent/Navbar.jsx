import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="font-sans mb-[85px] bg-black">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-16 lg:px-20 flex justify-between items-center">
          <div className="min-w-[150px]">
            <img
              src="IMG-20250422-WA0087.jpg"
              alt="Logo"
              className="w-[150px] h-auto object-contain -ml-2"
            />
          </div>

          <nav className="hidden xl:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">HOME</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium">ABOUT US</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-green-600 font-medium">GALLERY</Link>

            {/* SERVICES - click dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-700 hover:text-green-600 font-medium flex items-center"
              >
                SERVICES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesOpen && (
                <div className="absolute bg-white shadow-lg rounded-md mt-1 py-2 w-60 z-50">
                  <Link to="/basic-quran-reading" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Basic Quran Reading</Link>
                  <Link to="/quran-course-for-kids" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Course For Kids</Link>
                  <Link to="/quran-memorization-hifz" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Memorization Hifz</Link>
                  <Link to="/learn-islamic-concepts" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Learn Islamic Concepts</Link>
                </div>
              )}
            </div>

            <Link to="https://saylaniwelfare.com/en/donate" className="text-gray-700 hover:text-green-600 font-medium">DONATION</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium">CONTACT US</Link>
            <Link to="/career" className="text-gray-700 hover:text-green-600 font-medium">CAREER</Link>
            <Link to="/register" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium">Register</Link>
            <Link to="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium">Login</Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 flex justify-between items-center border-b">
          <div className="text-lg font-bold text-green-600">Menu</div>
          <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-green-600 font-medium">HOME</Link>
          <Link to="/about" className="block text-gray-700 hover:text-green-600 font-medium">ABOUT US</Link>
          <Link to="/gallery" className="block text-gray-700 hover:text-green-600 font-medium">GALLERY</Link>

          {/* SERVICES Mobile */}
          <div>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center justify-between w-full text-gray-700 hover:text-green-600 font-medium"
            >
              <span>SERVICES</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServicesOpen && (
              <div className="mt-2 space-y-2 pl-2">
                <Link to="/basic-quran-reading" className="block text-gray-700 hover:text-green-600">Basic Quran Reading</Link>
                <Link to="/quran-course-for-kids" className="block text-gray-700 hover:text-green-600">Quran Course For Kids</Link>
                <Link to="/quran-memorization-hifz" className="block text-gray-700 hover:text-green-600">Quran Memorization Hifz</Link>
                <Link to="/learn-islamic-concepts" className="block text-gray-700 hover:text-green-600">Learn Islamic Concepts</Link>
              </div>
            )}
          </div>

          <Link to="/donation" className="block text-gray-700 hover:text-green-600 font-medium">DONATION</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-green-600 font-medium">CONTACT US</Link>
          <Link to="/career" className="block text-gray-700 hover:text-green-600 font-medium">CAREER</Link>
          <Link to="/student-regsiter" className="block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium text-center">Register</Link>
          <Link to="/login" className="block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium text-center">Login</Link>
        </nav>
      </div>
    </div>
  );
}
