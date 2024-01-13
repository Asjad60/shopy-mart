import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import IconButton from "../../common/IconButton";
import { useNavigate } from "react-router-dom";

const ImageSectionSlider = ({ products }) => {
  const navigate = useNavigate();
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="bg-white h-[430px]  md:h-[620px] w-full "
      >
        {products?.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="flex justify-center flex-col md:flex-row  md:ml-0 gap-y-4 sm:gap-x-10 w-full p-2 md:p-6">
                <div className="flex gap-4 flex-col items-center md:items-start justify-center md:w-2/5">
                  <h1 className="text-4xl sm:text-5xl font-semibold">
                    {product?.brand}{" "}
                  </h1>
                  <p className=" text-gray-600 md:w-3/5 text-center md:text-start">
                    {product?.productDescription.split(" ").length > 10
                      ? product?.productDescription
                          .split(" ")
                          .slice(0, 10)
                          .join(" ")
                      : product?.productDescription}
                  </p>
                  <IconButton
                    text={"Shop Now"}
                    onclick={() => navigate(`/products/${product._id}`)}
                    customClasses={"md:self-start whitespace-nowrap"}
                  />
                </div>

                <div className="flex justify-center">
                <img
                  src={product?.thumbnail}
                  alt=""
                  className=" w-60 h-60 md:max-w-[500px] md:w-full md:min-h-[500px] md:h-full object-cover"
                  loading="lazy"
                />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default ImageSectionSlider;
