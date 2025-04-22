import React from 'react'
import QuranLearningSection from '../../Components/HomeComponent/QuranLearningSection';
import Hero from '../../Components/HomeComponent/Hero';
import HomeNavbar from '../../Components/HomeComponent/Navbar';
import Footer from '../../Components/HomeComponent/Footer';

const LearnIslamicConcepts = () => {
    const features = [
        
        {
          description: 'Being a Hafiz-e-Quran is a dream for many Muslims around the world, and this course is making that dream accessible to all Muslims, in the ease of their homes.'
        },
        {
             description:"In other words, basic Quran reading is the starting process in which the child or the user starts to learn the Arabic alphabet through the online reading of the Quran. Focus on the correct pronunciation of each letter. Arabic letters have distinct sounds that may differ from those in other languages. Tajweed is the set of rules governing the correct pronunciation of the Quran. It involves correct articulation of letters, elongation of vowels, and other rules. Seek guidance from a knowledgeable teacher to understand Tajweed rules. Start practicing recitation slowly and accurately. Listen to proficient reciters and try to mimic their pronunciation and inflection. Online Quran classes also help students to know the meaning of commonly repeated words."
        },
        {
            description: 'Basic learning of the Quran is the base of memorizing the Quran with the right pronunciation and tajweed helps users and students to learn the Quran online more easily and efficiently. Remember, the key to mastering Quranic reading lies in regular practice, sincere intention, and seeking guidance from knowledgeable individuals. May your journey toward understanding and reciting the Quran be filled with blessings and enlightenment.'
        }
      ];
  return (
   <>
   <HomeNavbar/>
      <Hero
        title="Learn Islamic Concepts"
        backgroundColor="#003E3B"
      />
       <QuranLearningSection
        subtitle="We offer the teaching of The Holy Quran in thorough way, so that people of every age can start on their learning journey with ease and proper guidance."

        
        description="The Quran itself praises those who have memorized its verses, Surah Al-Qiyamah, Verse 17-18:"
        

        features={features}


        imageSrc="/IMG-20250422-WA0090.jpg"
      />

     <Footer/>
     
    </>
  )
}

export default LearnIslamicConcepts