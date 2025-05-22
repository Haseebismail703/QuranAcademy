import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';

const slides = [
  { id: 1, image: 'https://www.quranteacher.net/public_html/slide_image/WhatsApp_Image_2021-01-25_at_10_59_26_AM.jpeg', title: 'Slide 1' },
  { id: 2, image: 'https://www.quranteacher.net/public_html/slide_image/04.jpg', title: 'Slide 2' },
  { id: 3, image: 'https://www.quranteacher.net/public_html/slide_image/06.jpg', title: 'Slide 3' },
  { id: 4, image: 'https://www.quranteacher.net/public_html/slide_image/01.jpg', title: 'Slide 4' },

];

const slidesTwo = [
    
    { id: 1, image: 'https://www.quranteacher.net/public_html/slide_image/06.jpg', },
    { id: 2, image: 'https://www.quranteacher.net/public_html/slide_image/01.jpg',  },
    { id: 3, image: 'https://www.quranteacher.net/public_html/slide_image/WhatsApp_Image_2021-01-25_at_10_59_26_AM.jpeg', },
    { id: 4, image: 'https://www.quranteacher.net/public_html/slide_image/04.jpg',  },
  
  ];

export default function ImageCarousel() {
    return (
      <div className="bg-[#EFEFEF] p-5 overflow-hidden">
        <div className="max-w-[1390px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Image Gallery</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Beautiful moments captured and displayed in a card style.</p>
        </div>

          <div className="flex flex-col xl:flex-row gap-10 justify-center items-center">
            <div className="w-full flex justify-center">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] xl:max-w-[450px] h-[400px] p-2 bg-white border-2 border-white rounded-xl overflow-hidden"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
  
            <div className="w-full flex justify-center">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] xl:max-w-[450px] h-[400px] p-2 bg-white border-2 border-white rounded-xl overflow-hidden"
              >
                {slidesTwo.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    );
  }