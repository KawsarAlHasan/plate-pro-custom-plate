"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import { useShapeList } from "../../api/shapeListApi";
import { Image } from "antd";

export default function FeaturedShapeAndSize() {
  const { shapeList, isLoading, isError, mutate } = useShapeList();

  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <>
      <div className="swipper_slider_wrapper w-full flex justify-center py-12">
        <div className="swipper_slider w-full max-w-[1712px]">
          <h4 className="text-2xl font-bold mb-4">Featured Shape and size</h4>
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
            {shapeList?.map((item, i) => (
              <SwiperSlide key={i}>
                <div className=" pb-4 border-b border-b-gray-300 p-2">
                  <div className="aspect-[388/348] border-2 border-amber-400 flex items-center justify-center ">
                    <Image
                      src={item?.icon}
                      alt={item?.name}
                      preview={false}
                      className="object-contain w-full"
                    />
                  </div>
                  <div className="flex justify-between gap-6 p-2">
                    <h5 className="text-md font-medium">{item?.name}</h5>
                    <p className="text-red-500">
                      €
                      {item?.variants[0]
                        ? Number(item?.variants[0]?.price)?.toFixed(2)
                        : "0.00"}{" "}
                      EUR
                    </p>
                  </div>
                  <Link href={`/shapes?shapeId=${item?.id}`}>
                    <div className="w-full text-center bg-black text-white py-2">
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
  );
}
