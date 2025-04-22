import React from 'react';

const Hero = ({ title, description, backgroundImage, backgroundColor }) => {
  return (
    <div className="relative text-white py-12 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none', 
          backgroundColor: backgroundColor || 'transparent', 
          opacity: 0.8,
          filter: backgroundImage ? 'brightness(0.3) sepia(0.4) hue-rotate(90deg)' : 'none', 
        }}
      ></div>

      <div className="container mx-auto text-center relative z-10 p-5">
        <h1 className="text-3xl md:text-4xl font-bold text-lime-400 mb-6">{title}</h1>
        <p className="md:text-xl max-w-3xl mx-auto">{description}</p>
      </div>
    </div>
  );
};

export default Hero;