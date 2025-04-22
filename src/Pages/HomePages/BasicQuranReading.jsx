import React from 'react'
import QuranLearningSection from '../../Components/HomeComponent/QuranLearningSection';
import Hero from '../../Components/HomeComponent/Hero';
import HomeNavbar from '../../Components/HomeComponent/Navbar';
import Footer from '../../Components/HomeComponent/Footer';

const BasicQuranReading = () => {
    const features = [
        
        {
          description: 'Online Quran classes also give the basic teaching of tajweed and pronouncing the Arabic words which help them to learn and read the Quran these basics which are provided through the website of Qurani Academy are also useful and help children and users in memoizing the Quran through online sessions. Set aside dedicated time daily to practice reading. Gradually increase the duration as you become more comfortable with apps or websites offering Quranic texts, audio recitations, and interactive lessons for practice and learning.'
        },
        {
            description: 'Basic learning of the Quran is the base of memorizing the Quran with the right pronunciation and tajweed helps users and students to learn the Quran online more easily and efficiently. Remember, the key to mastering Quranic reading lies in regular practice, sincere intention, and seeking guidance from knowledgeable individuals. May your journey toward understanding and reciting the Quran be filled with blessings and enlightenment.'
        }
      ];
  return (
   <>
   <HomeNavbar/>
      <Hero
        title="Basic Quran Reading"
        backgroundColor="#003E3B"
      />
       <QuranLearningSection
        
        subtitle="In this course, we offer teach basic Quran Readings, so the students can learn to read Arabic. Through this course a person can be equipped to read The Holy Quran on their own."
        description="In other words, basic Quran reading is the starting process in which the child or the user starts to learn the Arabic alphabet through the online reading of the Quran. Focus on the correct pronunciation of each letter. Arabic letters have distinct sounds that may differ from those in other languages. Tajweed is the set of rules governing the correct pronunciation of the Quran. It involves correct articulation of letters, elongation of vowels, and other rules. Seek guidance from a knowledgeable teacher to understand Tajweed rules. Start practicing recitation slowly and accurately. Listen to proficient reciters and try to mimic their pronunciation and inflection. Online Quran classes also help students to know the meaning of commonly repeated words."

        features={features}
        imageSrc="/IMG-20250422-WA0088.jpg"
      />

     <Footer/>
     
    </>
  )
}

export default BasicQuranReading