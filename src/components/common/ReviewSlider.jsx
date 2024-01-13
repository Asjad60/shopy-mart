import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, FreeMode } from "swiper/modules";

import { apiConnector } from "../../services/apiconnector";
import { reviewEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        reviewEndpoints.GET_REVIEW_API
      );
      console.log("data ===> ", data);
      if (data?.success) {
        setReviews(data?.allReviews);
      }
    })();
  }, []);

  console.log(reviews);

  return (
    <div className=" w-full">
      <Swiper
        slidesPerView={1.2}
        freeMode={true}
        loop={true}
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
      >
        {reviews.length > 0 &&
          reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col bg-slate-900 max-w-[250px] min-h-[150px] h-full w-full  overflow-hidden  mr-4 p-3 text-[14px] text-slate-50">
                  <p className="font-medium text-slate-50 text-sm">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>

                  <div className="flex items-center gap-4 mt-6">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.name}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.name}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500 ">
                        {review?.product?.productName}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-10">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}

export default ReviewSlider;
