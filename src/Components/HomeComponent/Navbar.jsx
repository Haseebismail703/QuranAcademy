import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="flex justify-between items-center px-6 lg:px-24 xl:px-52 py-2">
          <div className="text-green-600 font-bold text-xl mr-10">
            <img
              src="IMG-20250422-WA0087.jpg"
              alt="Logo"
               style={{marginLeft : "-20"}}
              width={150} height={150}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">HOME</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium">ABOUT US</Link>

            <div className="relative group">
              <span className="text-gray-700 hover:text-green-600 font-medium flex items-center cursor-pointer">
                SERVICES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-1 py-2 w-48 z-50">
                <Link to="/basic-quran-reading" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Basic Quran Reading</Link>
                <Link to="/quran-course-for-kids" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Course For Kids</Link>
                <Link to="/quran-memorization-hifz" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Memorization Hifz</Link>
                <Link to="/learn-islamic-concepts" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Learn Islamic Concepts</Link>
              </div>
            </div>

            <Link to="#" className="text-gray-700 hover:text-green-600 font-medium">PACKAGES</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium">CONTACT US</Link>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium"
            >
              LOGIN
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <div className="text-lg font-bold text-green-600">Menu</div>
          <button onClick={toggleSidebar} className="text-gray-700">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <div className="space-y-4">
            <Link to="/home" className="block text-gray-700 hover:text-green-600 font-medium py-2">HOME</Link>
            <Link to="/about" className="block text-gray-700 hover:text-green-600 font-medium py-2">ABOUT US</Link>

            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="w-full text-left text-gray-700 hover:text-green-600 font-medium flex items-center"
              >
                SERVICES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesOpen && (
                <div className="bg-white mt-2 shadow rounded-md py-2">
                  <Link to="/basic-quran-reading" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Basic Quran Reading</Link>
                  <Link to="/quran-course-for-kids" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Course For Kids</Link>
                  <Link to="/quran-memorization-hifz" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Quran Memorization Hifz</Link>
                  <Link to="/learn-islamic-concepts" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">Learn Islamic Concepts</Link>
                </div>
              )}
            </div>

            <Link to="#" className="block text-gray-700 hover:text-green-600 font-medium py-2">PACKAGES</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-green-600 font-medium py-2">CONTACT US</Link>
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                setSidebarOpen(false);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium w-full mt-4"
            >
              LOGIN
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative animate-fadeIn">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">Login As</h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded text-center"
              >
                Student Login
              </Link>
              <Link
                to="/teacher-login"
                onClick={() => setIsLoginModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center"
              >
                Teacher Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
