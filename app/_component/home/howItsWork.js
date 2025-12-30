'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function HowItsWork() {
    const [swiperRef, setSwiperRef] = useState(null);
    return (
        <>
            <section className='w-full flex flex justify-center py-12'>
                <div className='HowItsWork_wrapper w-full max-w-[1712px]   py-14 px-20 flex flex-col gap-8 md:gap-2 md:flex-row justify-between items-center'>
                    {/* ---how_its_work_content--- */}
                    <div className='w-full md:w-2/5 max-w-[438px] text-white'>
                        <h4 className='text-2xl mb-6'>How it works</h4>
                        <p>We create smart, easy-to-use tools that simplify floor plate design and ordering. Our goal is to make layout customization fast, accurate, and effortless for everyone</p>
                    </div>
                    {/* ---how_its_work_slider--- */}
                    <div className='w-full md:w-3/5'>
                        <Swiper
                            onSwiper={setSwiperRef}
                            loop={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            // pagination={{ clickable: true }}
                            
                            navigation={true}
                            modules={[Autoplay, Navigation]}
                            className="mySwiper"
                            breakpoints={{
                                0: { slidesPerView: 1, spaceBetween: 10 },
                                640: { slidesPerView: 1, spaceBetween: 20 },
                                1024: { slidesPerView: 2, spaceBetween: 30 },
                                1280: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                        >
                            {["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5", "Slide 6"].map((text, i) => (
                                <SwiperSlide key={i}>
                                    <div className="aspect-[378/433] flex flex-col items-center justify-center gap-5 bg-white p-11 rounded-xl">
                                        {/* ---card header-- */}
                                        <div className='w-full  flex justify-center '>
                                            {/* --instruction step-- */}
                                            <div className='step_Indicator'>{text}</div>
                                        </div>
                                        {/* --instruction-- */}
                                        <div className='text-center'>
                                            <b>Select your plate type</b>
                                            <p>Choose the floor plate that fits your needs. Browse through a variety of sizes and shapes to find the one that works best for your space</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
        </>
    )
}
// bg-[url("/howItsWork.png")]