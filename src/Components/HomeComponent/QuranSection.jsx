export default function QuranSection() {
    return (
      <div
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/IMG-20250422-WA0091.jpg')" }}
      >
        <div className="w-full h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-10 md:px-16 lg:px-20 w-full">
            <div className="w-full md:w-2/3 lg:w-1/2 text-center md:text-left">
              <h6 className="text-3xl md:text-4xl font-bold text-[#B1881F] leading-tight mb-6">
                We are always ready to serve you the best.
              </h6>
              <p className="text-gray-800 md:text-2xl mb-8">
                We have courses available that offer online Quran classes for
                learners of all ages and levels.
              </p>
              <button className="px-4 py-2 text-sm md:px-6 md:py-3 md:text-base bg-green-800 hover:bg-green-900 text-white rounded-md font-medium">
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }