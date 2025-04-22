import React from 'react';

const QuranLearningSection = ({ 
  title, 
  subtitle, 
  description, 
  features, 
  imageSrc 
}) => {
  return (
    <div className="flex flex-col bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-16 lg:px-20">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-between">
          
          <div className={`flex-1 max-w-xl ${!title && 'flex flex-col items-center justify-center'}`}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {title}
              </h2>
            )}
            <div className="border-l-4 border-lime-600 pl-4 mb-6">
              <p className="text-xl text-gray-700">
                {subtitle}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              {description}
            </p>

            {features && features.map((feature, index) => (
              <div className="mb-6" key={index}>
                <h3 className="text-lg font-bold text-gray-700">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1">
            <img
              src={imageSrc}
              alt="Open Quran with candle"
              className="shadow-lg w-full h-auto md:h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranLearningSection;