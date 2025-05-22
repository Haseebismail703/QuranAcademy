import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const videoData1 = [
  { id: 1, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-4.mp4' },
  { id: 2, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-6.mp4' },
  { id: 3, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-1.mp4' },
];

const videoData2 = [
  { id: 4, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-5.mp4' },
  { id: 5, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-2.mp4' },
  { id: 6, src: 'https://data2.dawateislami.net/static/images/main-website/foa/video-3.mp4' },
];

export default function VideoGallery() {
    return (
      <div className="py-10 px-5 bg-[#EFEFEF]">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Video Gallery</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[videoData1, videoData2].map((videos, index) => (
            <div key={index} className="w-full lg:max-w-[600px] mx-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                loop={true}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
              >
                {videos.map((video) => (
                  <SwiperSlide key={video.id} className="flex justify-center items-center">
                    <div className="w-full aspect-video">
                      <video controls className="w-full h-full object-cover rounded-xl shadow-lg">
                        <source src={video.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>
    );
  }
