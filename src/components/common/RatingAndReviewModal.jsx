import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import IconButton from "./IconButton";
import { useForm } from "react-hook-form";
import { createRating } from "../../services/operations/productApi";
import { useSelector } from "react-redux";

const RatingAndReviewModal = ({ setRatingAndReviewModal ,productId}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {token} = useSelector(state => state.auth)

  useEffect(()=>{
    setValue("productRating", 0);
    setValue("productReview", "");

    // eslint-disable-next-line
  },[])

  const ratingChange = (newRating) => {
    setValue("productRating",newRating);
  };

  const onSubmit = async(data) => {
    await createRating(
      {
        productId:productId,
        rating:data.productRating,
        review:data.productReview
      },
      token
    )

    setRatingAndReviewModal(false)
  };

  return (
    <div className=" fixed inset-0 bg-[rgba(0,0,0,0.2)] grid place-items-center backdrop-blur-[3px] text-white overflow-auto">
      <div className="border border-slate-500 bg-slate-800 max-w-[500px] w-full p-4 rounded-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full justify-center">
            <ReactStars
              count={5}
              size={50}
              onChange={ratingChange}
              activeColor="#ffd700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="review" className="font-medium text-lg">
              Review
            </label>
            <textarea
              name="review"
              id="review"
              className="form-style resize-none"
              {...register("productReview",{required:true})}
            ></textarea>
            {
              errors.productReview && (
                <span className="text-sm text-red-500">
                  Please Add Product Review
                </span>
              )
            }
          </div>

          <div className="flex justify-between">
            <button className="form-style" type="button" 
            onClick={() => setRatingAndReviewModal(false)}
            >Cancel</button>
            <IconButton type={"submit"} text={"Submit"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingAndReviewModal;
