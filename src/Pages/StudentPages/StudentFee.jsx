import { useState } from "react";
import { Calendar, DollarSign, Package } from "lucide-react"; // Importing Lucide icons

const paymentData = [
  {
    title: "Premium Package",
    description: "Physics 301",
    price: "$799",
    duration: "12 Months",
    endDate: "2028-03-30",
  },
  {
    title: "Basic Package",
    description: "Math 101",
    price: "$499",
    duration: "6 Months",
    endDate: "2027-12-15",
  },
  {
    title: "Advanced Package",
    description: "Chemistry 401",
    price: "$999",
    duration: "18 Months",
    endDate: "2029-06-20",
  },
];

export default function FeePaymentPage() {
  return (
    <div className="p-3">
      <div className="flex items-center mb-8">
        <DollarSign className="text-3xl mr-3 text-blue-600" />
        <h2 className="text-3xl font-semibold">Course Fee</h2>
      </div>

      <div className="w-full flex justify-center md:justify-start flex-wrap gap-6 mt-10">
  {paymentData.map((payment, index) => (
    <div
      key={index}
      className="bg-white text-black rounded-3xl p-6 sm:p-8 shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer border-t-4  border-blue-500 w-full sm:w-[360px] md:w-[340px] lg:w-[360px]"
    >
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">{payment.title}</h3>

      <p className="text-sm mb-4 sm:mb-6 opacity-80">{payment.description}</p>

      <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{payment.price}</div>

      <div className="flex items-center mb-3 sm:mb-4 opacity-80">
        <Calendar className="mr-2" />
        <p className="text-sm">{payment.duration}</p>
      </div>

      <div className="flex items-center mb-4 sm:mb-6 opacity-70">
        <Calendar className="mr-2" />
        <p className="text-sm">Ends: {payment.endDate}</p>
      </div>

      <div className="flex justify-center">
        <button className="bg-gray-100 text-black px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105">
          Pay Now
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

