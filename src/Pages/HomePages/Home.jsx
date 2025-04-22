import React from 'react'
import Navbar from '../../Components/HomeComponent/Navbar'
import HeroSection from '../../Components/HomeComponent/HeroSection'
import AboutSection from '../../Components/HomeComponent/AboutUs'
import Services from '../../Components/HomeComponent/Services'
import QuranSection from '../../Components/HomeComponent/QuranSEction'
import Footer from '../../Components/HomeComponent/Footer'
const Home = () => {
    return (
       <>
       <Navbar/>
       <HeroSection/>
       <AboutSection/>
       <Services/>
       <QuranSection/>
       <Footer/>
       </>
    )
}

export default Home