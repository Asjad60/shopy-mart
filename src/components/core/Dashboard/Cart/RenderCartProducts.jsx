import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { AiFillStar } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
// import ReactStars from "react-rating-stars-component";
import { removeFromCart, updateQuantity } from "../../../../slices/cartSlice";
import GetAvgRating from "../../../../utils/avgRating";
import RatingStars from "../../../common/RatingStars";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast";

const RenderCartProducts = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const avgCounts = {};
    cart.forEach((element) => {
      const count = GetAvgRating(element?.ratingAndReviews);
      avgCounts[element?._id] = count;
    });

    setAvgReviewCount(avgCounts);
  }, [cart]);

  const handleRemoveFromCart = (event, productId) => {
    event.preventDefault();
    dispatch(removeFromCart(productId));
  };

  const handleChangeQuantity = (productId,quantity) => {
    const product = cart.find(product => product._id === productId)
    if(product.stock < quantity){
      toast.error("Stock not Available")
      return
    }
    dispatch(updateQuantity({productId,quantity}))
  }

  return (
    <div className=" divide-y divide-[#2C333F] w-full">
      {cart.map((product, index) => (
        <Link
          to={`/products/${product._id}`}
          key={index}
          className="flex justify-between p-2"
        >
          <div className="flex gap-4 max-[570px]:flex-col w-full">
            <img
              src={product?.thumbnail}
              alt={product?.productName}
              className="w-24 sm:max-w-[150px] sm:w-full sm:min-h-[150px] sm:h-full object-cover rounded-md"
            />
            <div className="flex flex-col flex-1">
              <p className={"uppercase"}>{product?.productName}</p>
              <p className="opacity-50">{product?.category?.name}</p>
              <div className="flex gap-x-2 items-center text-[11px]">
                <span>{avgReviewCount[product._id] || 0}</span>
                {/* <ReactStars
                  count={5}
                  value={product?.ratingAndReviews?.length}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<AiFillStar />}
                  fullIcon={<AiFillStar />}
                /> */}
                <span className="mb-1">
                  <RatingStars
                    Review_Count={avgReviewCount[product._id]}
                    Star_Size={15}
                  />
                </span>
                <span className="text-white whitespace-nowrap">
                  {product?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div onClick={(e)=> e.preventDefault()}>
            <select 
            name="quantity" 
            id="quantity" 
            className="bg-[#2c333f] px-2 py-[6px] border-b border-b-slate-400 rounded-md outline-none"
            onChange={(e)=> handleChangeQuantity(product._id,e.target.value)}
            defaultValue={product?.quantity}
            >
              {
                 Array(5).fill(null).map((_,i)=>(
                  <option value={i+1} key={i}>{i+1}</option>
                ))
              }
            </select>
          </div>

          <div className="flex flex-col items-center gap-y-3 max-h-[100px]">
            <button
              onClick={(event) => handleRemoveFromCart(event, product?._id)}
              className="flex gap-x-2 items-center bg-[#161d29] p-2 rounded-md text-red-600"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="text-xl font-medium text-yellow-400">
              ₹ {product?.price}
            </p>
          </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RenderCartProducts;
