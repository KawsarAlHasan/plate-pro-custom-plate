'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedShapeAndSize() {
    const [swiperRef, setSwiperRef] = useState(null);
    const shapeAndPlates = [
        {
            id: 1,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/Square.png'
        },
        {
            id: 2,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/ushape.png'
        },
        {
            id: 3,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/ractangle_with_rounded_corner.png'
        },
        {
            id: 4,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/reactangle.png'
        },
        {
            id: 5,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/Square.png'
        },
        {
            id: 6,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/ushape.png'
        },
        {
            id: 7,
            title: 'Stove floor plate 66 x 80 cm matt black',
            price: 88.00,
            image: '/Square.png'
        },
    ]
    return (
        <>
            <div className='swipper_slider_wrapper w-full flex justify-center py-12'>
                <div className='swipper_slider w-full max-w-[1712px]'>
                    <h4 className='text-2xl font-bold mb-4'>Featured Shape and size</h4>
                    <Swiper
                        onSwiper={setSwiperRef}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        // pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                            1280: { slidesPerView: 4, spaceBetween: 40 },
                        }}
                    >
                        {shapeAndPlates.map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className=' pb-4 border-b border-b-gray-300 p-2'>
                                    <div className="aspect-[388/448] border-2 border-amber-400 flex items-center justify-center">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={'388'}
                                            height={'448'}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className='flex justify-between gap-6 p-2'>
                                        <h5 className="text-md font-medium">{item.title}</h5>
                                        <p className='text-red-500'>€{item.price.toFixed(2)}EUR</p>
                                    </div>
                                    <Link href='/shapes'>
                                    <div className='w-full text-center bg-black text-white py-2'>
                                        <span>Get started</span>
                                    </div>
                                    </Link>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </div>
        </>
    )
}
