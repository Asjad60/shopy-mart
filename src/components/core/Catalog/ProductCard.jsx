import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const Product_Card = ({ product, Height = "", Width }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(product?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [product]);

  return (
    <>
      <Link
        to={`/products/${product._id}`}
        className="group inline-block max-w-[200px] select-none"
      >
        <div className="w-full">

            <img
              src={product?.thumbnail}
              alt={product?.name}
              className={`h-[200px] ${
                Width ? Width : "w-full"
              } rounded-xl object-cover group-hover:scale-95 transition-all `}
              loading="lazy"
            />
          <div className=" overflow-hidden mt-1">
            <p className="font-medium uppercase">
              {product?.productName.split(" ").length > 10
                ? product?.productName.split(" ").slice(0, 10).join(" ")
                : product?.productName}
            </p>
            <div className="flex gap-x-2 text-sm">
              <span>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={17} />
              <span className="">
                {product?.ratingAndReviews?.length} Ratings
              </span>
            </div>
          </div>
          <p className="text-lg font-medium">Rs. {product?.price}</p>
        </div>
      </Link>
    </>
  );
};

export default Product_Card;
