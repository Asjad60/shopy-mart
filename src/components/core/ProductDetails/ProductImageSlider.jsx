import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { Pagination, EffectCube} from "swiper/modules";

const ProductImageSlider = ({ images }) => {
  return (
    <Swiper
      effect={'cube'}
      centeredSlides={true}
      grabCursor={true}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      modules={[Pagination,EffectCube]}
      cubeEffect={{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }}
      className="mySwiper max-w-[400px] w-full "
    >
      {images?.map((image, index) => (
        <SwiperSlide key={index} className="max-w-[400px] w-full  max-h-[400px] h-full bg-white">
          <img
            src={image}
            alt="ProductImage"
            className="max-w-[400px] w-full  max-h-[400px] h-full  object-contain rounded-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductImageSlider;
