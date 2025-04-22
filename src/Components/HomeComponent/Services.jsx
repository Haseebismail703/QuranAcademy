import React from 'react'

function Services() {
    return (
        <div className='bg-[#EFEFEF] p-5'>
            {/* first section */}
            <div className='flex justify-center '>
                <div className=' rounded-md bg-[#5EBC00] w-30 ' >
                    <p className='text-white text-sm text-center'>OUR SERVICES</p>
                </div>
            </div>
            {/*  */}
            <div className='flex justify-center mt-2 '>
                <h1 className='text-[36px] text-[#B1881F]'>What We Offer</h1>
            </div>
            {/*  */}
            <div className="flex justify-center">
                <div className="mt-2 w-full max-w-[600px] px-4">
                    <p className="text-[16px] text-center tracking-tight font-medium">
                        We offer the teaching of The Holy Quran in a thorough way, so that people of every age can start on their learning journey with ease and proper guidance.
                    </p>
                </div>
            </div>


            {/* second section */}

            <div className="flex justify-evenly flex-wrap gap-6 mt-10 px-4">
                {/* Card 1 */}
                <div className="rounded-[30px] bg-white flex flex-col lg:flex-row items-center gap-4 p-4 w-full sm:w-[90%] md:w-[80%] lg:w-[555px]  ">
                    <img
                        className="h-[101px] w-[101px] object-contain"
                        src="https://quraniacademy.com/wp-content/uploads/2023/02/srv-001.png"
                        alt="Basic Quran"
                    />
                    <div className="flex flex-col text-center lg:text-left">
                        <h1 className="text-lg sm:text-xl font-semibold mb-1">BASIC QURAN READING</h1>
                        <p className="text-sm text-gray-600">
                            In this course, we teach basic Quran reading, so students can learn to read Arabic.
                            Through this course, a person can be equipped to read The Holy Quran on their own.
                        </p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-[30px] bg-white flex flex-col lg:flex-row items-center gap-4 p-4 w-full sm:w-[90%] md:w-[80%] lg:w-[555px]">
                    <img
                        className="h-[101px] w-[101px] object-contain"
                        src="https://quraniacademy.com/wp-content/uploads/2023/02/srv-002.png"
                        alt="QURAN COURSE TO KIDS"
                    />
                    <div className="flex flex-col text-center lg:text-left">
                        <h1 className="text-lg sm:text-xl font-semibold mb-1">QURAN COURSE TO KIDS</h1>
                        <p className="text-sm text-gray-600">
                            This course focuses primarily on Kids/Children. The earlier you start teaching your kids about the Holy Quran, the easier it will be for them to grasp the concept and linguistics of the Arabic language, and it will also build the habit of reading the precious book of God at an early age.
                        </p>
                    </div>
                </div>
            </div>

            <br />
            <div className='flex justify-evenly flex-wrap gap-4 p-4'>
                {/* Card 3 */}
                <div className='rounded-[30px] w-full sm:w-[90%] md:w-[80%] lg:w-[555px] bg-[#FFFFFF] p-5'>
                    <div className='flex flex-col lg:flex-row gap-5'>
                        <img
                            className="h-[101px] w-[101px] object-contain mx-auto lg:mx-0"
                            src="https://quraniacademy.com/wp-content/uploads/2023/02/srv-003.png"
                            alt="QURAN COURSE TO KIDS"
                        />

                        <div className='flex flex-col text-center lg:text-left'>
                            <h1 className="text-lg font-semibold mb-2">QURAN MEMORIZATION (HIFZ)</h1>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                The Quran itself praises those who have memorized its verses, Surah Al-Qiyamah, Verse 17-18:
                                <br /><br />
                                <b>
                                “Indeed, upon Us is its collection [in your heart] and [to make possible] its recitation. So when We have recited it [through Gabriel], then follow its recitation. Then upon Us is its clarification [to you].”
                                </b>
                                <br /><br />
                                Being a Hafiz-e-Quran is a dream for many Muslims around the world, and this course is making that dream accessible to all Muslims, in the ease of their homes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className='rounded-[30px] w-full sm:w-[90%] md:w-[80%] lg:w-[555px] bg-[#FFFFFF] p-5'>
                    <div className='flex flex-col lg:flex-row gap-5'>
                        <img
                            className="h-[101px] w-[101px] object-contain mx-auto lg:mx-0"
                            src="https://quraniacademy.com/wp-content/uploads/2023/02/srv-004.png"
                            alt="QURAN COURSE TO KIDS"
                        />

                        <div className='flex flex-col text-center lg:text-left'>
                            <h1 className="text-lg font-semibold mb-2">LEARN ISLAMIC CONCEPTS</h1>
                            <p className="text-sm text-gray-600 leading-relaxed">
                            It should be noted that memorizing the Quran is not the only way to attain knowledge and understanding of its teachings. Muslims are encouraged to read and understand the Quran in their own language, even if they may not have the ability to memorize it in its entirety. The Quran emphasizes the importance of seeking knowledge, and it is through studying and reflecting upon its teachings that one can gain a deeper understanding of Islam and its message.
                            <b>
                              Surah Al-Isra, Verse 9: “Indeed, this Qur’an guides to that which is most suitable and gives good tidings to the believers who do righteous deeds that they will have a great reward.”  
                            </b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
