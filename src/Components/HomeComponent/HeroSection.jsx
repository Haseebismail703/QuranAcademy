import { useState, useEffect } from 'react';

export default function HeroSection() {
  const quotes = [
    `"Seek knowledge\nfrom the cradle\nto the grave"`,
    `"The best among you\nare those who learn the Quran\nand teach it"`,
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center bg-no-repeat bg-right bg-cover h-screen py-20 px-6 md:px-16"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/022/538/211/large_2x/the-holy-al-quran-with-written-arabic-calligraphy-meaning-of-al-quran-and-rosary-beads-or-tasbih-on-white-background-with-copy-space-photo.jpg')",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Text Area */}
        <div className="w-full md:w-1/2 space-y-6 flex flex-col items-start justify-center h-full">
          <button className="bg-green-500 text-white font-medium px-4 py-1 rounded-full text-sm">
            LEARN FOR YOURSELF
          </button>

          <h1 className="text-3xl md:text-5xl font-bold text-yellow-900 leading-snug whitespace-pre-line transition-opacity duration-1000 ease-in-out">
            {quotes[currentQuoteIndex]}
          </h1>

          <button className="bg-green-900 text-white px-6 py-2 rounded-md font-medium w-fit hover:bg-green-800">
            Contact us
          </button>
        </div>

        {/* Right empty area for background image positioning */}
        <div className="hidden md:block w-1/2"></div>
      </div>
    </div>
  );
}
