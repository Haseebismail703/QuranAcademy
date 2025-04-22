export default function AboutSection() {
  return (
    <div
      className="w-full bg-white py-12 px-4 md:px-16"
      style={{
        backgroundImage: "url('https://burst.shopifycdn.com/photos/quran-lantern-and-water.jpg?exif=0&iptc=0')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        
        {/* Left Side - Text */}
        <div className="md:w-1/2 space-y-5">
          <button className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ABOUT US
          </button>
    
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-900">
            Start learning Quran Today..
          </h2>
    
          <p className="border-l-4 border-green-600 pl-3 font-semibold text-gray-900">
            Assalamu Alaikum! Welcome to the world of online Quran learning.
          </p>
    
          <p className="text-gray-800">
            We have courses available that offer online Quran classes for learners of all ages and levels. What we promise:
          </p>
    
          <ul className="space-y-3 text-gray-800">
            <li><strong>Qualified Teachers:</strong> Qualified and experienced Quran teachers who have Ijazah and can teach Quran with Tajweed.</li>
            <li><strong>One-on-One Classes:</strong> One-on-one classes allow for personalized attention and effective learning.</li>
            <li><strong>Flexible Schedule:</strong> Online Quran learning offers the flexibility to learn at your own pace and schedule.</li>
            <li><strong>Quran Translation:</strong> It’s important to understand the meaning and interpretation of the Quranic verses.</li>
          </ul>
    
          <button className="mt-4 bg-green-900 text-white px-5 py-2 rounded-md hover:bg-green-800">
            Read more
          </button>
        </div>
    
        {/* Right Side - Single Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src="https://quraniacademy.com/wp-content/uploads/2023/02/aboutpic.png"
            alt="Quran"
            className="w-110 h-110 mt-10 object-cover  rounded-lg "
          />
        </div>
      </div>
    </div>
  );
}