import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyEnrolledOrders } from "../../../services/operations/profileApi";
import IconButton from "../../common/IconButton";
import { formatDate } from "../../../services/formatedDate";
import { cancelOrder } from "../../../services/operations/orderApi";
import RatingAndReviewModal from "../../common/RatingAndReviewModal";


const MyOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [myOrders, setMyOrders] = useState(null);
  const [ratingAndReviewModal, setRatingAndReviewModal] = useState(false);

  const getMyOrders = async () => {
    try {
      const response = await getMyEnrolledOrders(token);
      setMyOrders(response);
    } catch (error) {
      console.log("Unable to fetch enrollled Orders", error);
    }
  };
  useEffect(() => {
    getMyOrders();

    // eslint-disable-next-line
  }, []);

  // console.log("myOrders  ==> ", myOrders);

  const handleCancelOrder = async (orderId, productId) => {
    await cancelOrder({ orderId, productId }, token);
    getMyOrders();
  };

  const handleAddReview = (productId) => {
   setRatingAndReviewModal(productId)
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-medium">My Orders</h2>
      {!myOrders ? (
        <div className="grid place-content-center h-[70vh] w-full">
          <div className="spinner"></div>
        </div>
      ) : !myOrders.length ? (
        <div>You Dont Have Any Orders</div>
      ) : (
        <div className=" p-1 sm:p-3 mt-10 rounded-md">
          {myOrders?.map((orders, i) => (
            <div key={i} className="bg-[#161d29] mt-10">
              <div className="flex gap-x-6 justify-between sm:justify-normal sm:gap-x-10 p-3 border-b border-b-[#2c333f]">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div>
                    <p className="text-gray-300">{orders?.status}</p>
                    <p className="text-sm">{formatDate(orders?.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">PRICE</p>
                    <p className="text-sm">₹ {orders?.orderPrice}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div>
                    <p className="text-gray-300 whitespace-nowrap">SHIP TO</p>
                    <p className="text-sm">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 whitespace-nowrap">QUANTITY</p>
                    <p className="text-sm text-center">{orders?.quantity}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col min-[450px]:flex-row justify-between p-3 gap-5 w-full">
                <div className="flex gap-6">
                  <img
                    src={orders?.product?.thumbnail}
                    alt={orders?.product?.productName}
                    className="max-w-[100px] min-h-[100px] object-cover rounded-md"
                  />
                  <div>
                    <p className="uppercase">{orders?.product?.productName}</p>
                    <p className="text-gray-500 text-sm capitalize">
                      {orders?.product?.productDescription.length > 50
                        ? orders?.product?.productDescription.slice(0, 50)+("...")
                        : orders?.product?.productDescription}
                    </p>
                    <p>{orders?.size && "Size - " + orders?.size}</p>
                  </div>
                </div>

                <div className="flex min-[450px]:flex-col">
                  {(orders?.status !== "DELIVERED" && orders?.status !== "CANCELLED") && (
                    <button
                      className="bg-[#2c333f] border-b border-b-slate-500 rounded-md  py-2 px-9"
                      onClick={() =>
                        handleCancelOrder(orders?._id, orders?.product?._id)
                      }
                    >
                      Cancel
                    </button>
                  )}

                  {orders?.status === "DELIVERED" && (
                    <IconButton
                      text="Add Review"
                      type={"button"}
                      onclick={() => handleAddReview(orders?.product?._id)}
                      customClasses={"whitespace-nowrap"}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {ratingAndReviewModal && <RatingAndReviewModal setRatingAndReviewModal={setRatingAndReviewModal} productId={ratingAndReviewModal}/>}
    </div>
  );
};

export default MyOrders;
