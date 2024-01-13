import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IconButton from "../../common/IconButton";
import RatingAndReviewModal from "../../common/RatingAndReviewModal";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import { FaStar } from "react-icons/fa";
// import RatingsRange from "./RatingsRange";

const ProductReviews = ({ ratingAndReviews, productId }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [ratingCounts, setRatingCounts] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const navigate = useNavigate();

  const filterRating = (rating) => {
    return ratingAndReviews?.filter((ele) => ele.rating === rating)?.length;
  };

  useEffect(() => {
    const averageRating = GetAvgRating(ratingAndReviews);
    setAvgRating(averageRating);

    const rangeArr = [5, 4, 3, 2, 1].map((ratingNum) => ({
      ratingNum,
      average: filterRating(ratingNum),
    }));

    setRatingCounts(rangeArr);
  }, [ratingAndReviews]);

  const handleSubmitRatingAndReview = async () => {
    if (!token) {
      setConfirmationModal({
        text1: "You Are Not Logged In",
        text2: "Please Login to Rate Product",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(false),
      });
      return;
    }
    if (ratingAndReviews.some((ele) => ele.user.includes(user._id))) {
      setConfirmationModal({
        text1: "Already Reviewed",
        text2: "You Already Reviewed This Product",
        btn1Text: "<",
        // btn2Text: "Cancel",
        btn1Handler: () => setConfirmationModal(false),
        // btn2Handler: () => setConfirmationModal(false),
      });
      return;
    }
  };

  return (
    <>
      <div className="border border-[#2c333f] p-4 flex flex-col divide-y divide-[#2c333f]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Rating & Reviews</h1>
          <IconButton
            text={"Rate Product"}
            onclick={handleSubmitRatingAndReview}
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row  items-center py-2 sm:items-start gap-5 md:gap-20">
          <div className="md:w-[100px]">
            <h1 className="text-3xl flex items-center gap-1">
              {avgRating} <FaStar size={16} className="text-yellow-500" />
            </h1>
            <p className="text-sm">Rating & Reviews</p>
          </div>

          <div className="flex flex-col items-center max-w-[250px] w-full ">
            {ratingCounts.map((ele, i) => {
              return (
                <div className="flex gap-5 w-full" key={i}>
                  <p
                    className={`w-full flex items-center justify-center gap-1 `}
                  >
                    {ele.ratingNum}{" "}
                    <FaStar
                      size={10}
                      className={`${
                        i + 1 === ratingCounts.length && " translate-x-[2px]"
                      }`}
                    />
                  </p>

                  <div
                    className={`flex flex-col items-start ml-2 mt-[2px] w-full`}
                  >
                    <div className="relative overflow-hidden bg-[#2c333f] h-2 w-36 rounded-xl mt-[6px]">
                      <div
                        className="absolute left-0 bg-yellow-500 h-2"
                        style={{
                          width: `${
                            (ele.average / ratingAndReviews?.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="w-full flex justify-center text-sm items-center text-gray-400">
                    {ele.average}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-10 py-2">
          {ratingAndReviews?.map((ratingAndReview) => {
            return (
              <div key={ratingAndReview._id} className="flex flex-col gap-2">
                <p
                  className={`flex items-center gap-1 px-1 w-max rounded text-sm ${
                    ratingAndReview.rating === 1
                      ? "bg-red-600"
                      : ratingAndReview.rating === 2
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                >
                  {ratingAndReview.rating} <FaStar size={10} />
                </p>
                <p className="text-sm">{ratingAndReview.review}</p>
                <p className="text-gray-400 text-sm">
                 Customer: {ratingAndReview.user.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default ProductReviews;
