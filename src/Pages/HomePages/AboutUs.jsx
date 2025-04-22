import React from "react";
import QuranLearningSection from "../../Components/HomeComponent/QuranLearningSection";
import Hero from "../../Components/HomeComponent/Hero";
import HomeNavbar from "../../Components/HomeComponent/Navbar";
import Footer from "../../Components/HomeComponent/Footer";

const About = () => {
    const features = [
        {
          title: 'Qualified Teachers:',
          description: 'Qualified and experienced Quran teachers who have Ijazah and can teach Quran with Tajweed.'
        },
        {
          title: 'One-on-One Classes:',
          description: 'One-on-one classes allow for personalized attention and effective learning.'
        },
        {
          title: 'Flexible Schedule:',
          description: 'Learn at your own pace with timings that suit your routine.'
        },
        {
          title: 'Affordable Pricing:',
          description: 'Quality Quran education at prices that are accessible for everyone.'
        }
      ];
  return (
    <>
    <HomeNavbar/>
      <Hero
        title="About Us"
        description="Various versions have evolved over the years, sometimes by accident, sometimes on purpose injected humour."
        backgroundImage="/IMG-20250422-WA0086.jpg"
      />
       <QuranLearningSection
        title="Start learning Quran Today.."
        subtitle="Assalamu Alaikum! Welcome to the world of online Quran learning."
        description="We have courses available that offer online Quran classes for learners of all ages and levels. What we promise:"
        features={features}
        imageSrc="/IMG-20250422-WA0092.jpg"
      />
      <Footer/>
    </>
  );
};

export default About;