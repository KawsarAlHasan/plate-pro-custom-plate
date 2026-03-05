"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function HowItsWork({ howItWorksText }) {
  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <>
      <section className="w-full flex flex justify-center py-12">
        <div className="HowItsWork_wrapper w-full max-w-[1712px]   py-14 px-20 flex flex-col gap-8 md:gap-2 md:flex-row justify-between items-center">
          {/* ---how_its_work_content--- */}
          <div className="w-full md:w-2/5 max-w-[438px] text-white">
            <h4 className="text-2xl mb-6">{howItWorksText?.title}</h4>
            <p>{howItWorksText?.description}</p>
          </div>
          {/* ---how_its_work_slider--- */}
          <div className="w-full md:w-3/5">
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
              {howItWorksText?.steps?.map((record, i) => (
                <SwiperSlide key={i}>
                  <div className="aspect-[378/433] flex flex-col items-center justify-center gap-5 bg-white p-11 rounded-xl">
                    {/* ---card header-- */}
                    <div className="w-full  flex justify-center ">
                      {/* --instruction step-- */}
                      <div className="step_Indicator">{record?.mainTitle}</div>
                    </div>
                    {/* --instruction-- */}
                    <div className="text-center">
                      <b>{record?.title}</b>
                      <p>{record?.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
// bg-[url("/howItsWork.png")]
