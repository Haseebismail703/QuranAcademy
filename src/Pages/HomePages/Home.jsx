import React from 'react'
import Navbar from '../../Components/HomeComponent/Navbar'
import HeroSection from '../../Components/HomeComponent/HeroSection'
import AboutSection from '../../Components/HomeComponent/AboutUs'
import Services from '../../Components/HomeComponent/Services'
import QuranSection from '../../Components/HomeComponent/QuranSection'
import Footer from '../../Components/HomeComponent/Footer'
import ImageCarousel from '../../Components/HomeComponent/ImageCrousel'
import VideoGallery from '../../Components/HomeComponent/VideoCrousel'
const Home = () => {
    return (
       <>
       <Navbar/>
       <HeroSection/>
       <AboutSection/>
       <Services/>
       <QuranSection/>
       <ImageCarousel/>
       <VideoGallery/>
       <Footer/>
       </>
    )
}

export default Home