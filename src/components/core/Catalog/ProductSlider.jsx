import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import ProductCard from "./ProductCard";

const ProductSlider = ({ products }) => {
  return (
    <>
      {products?.length > 0 ? (
        <Swiper
          slidesPerView={1.2}
          freeMode={true}
          modules={[FreeMode, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            540: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          className="mySwiper w-full "
        >
          {products?.map((product, index) => {
            return (
              <SwiperSlide key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div>No Products Found</div>
      )}
    </>
  );
};

export default ProductSlider;
