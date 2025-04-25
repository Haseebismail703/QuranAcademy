import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {

  let date = new Date().getFullYear();
  return (
    <footer className="bg-[#004040] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-16 lg:px-20 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col justify-between gap-auto items-center sm:items-start w-full h-full">
            <img 
              src="/IMG-20250422-WA0092.jpg"
              alt="Qurani Academy"
              className="bg-white rounded-lg p-4 mb-4 h-24"
            />
            <div className="flex justify-between gap-6 lg:gap-4">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" className="bg-white rounded-full p-2">
                  <Icon className="w-5 h-5 text-[#004040]" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">OUR SERVICES</h3>
            <ul className="space-y-2">
              {[
                "BASIC QURAN READING",
                "QURAN COURSE TO KIDS",
                "QURAN MEMORIZATION (HIFZ)",
                "LEARN ISLAMIC CONCEPTS",
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="text-[#8BC34A] hover:underline">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              {["HOME", "ABOUT US", "CONTACT"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#8BC34A] hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">CONTACT DETAILS</h3>
            <p className="font-bold">Email:</p>
            <p className="text-[#8BC34A] break-words">
            info@saylanionlineacademy.com
            </p>
            <p className="font-bold mt-4">Phone:</p>
            <p className="text-[#8BC34A]">+923000652261</p>
          </div>
        </div>

        <p className="mt-10 pt-6 border-t border-gray-600 text-center text-sm md:text-base">
          © Copyright {date} Saylani Online Academy, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}