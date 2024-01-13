import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../../common/IconButton";
import { createOrder } from "../../../../services/operations/orderApi";
import { resetCart } from "../../../../slices/cartSlice";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleBuyProduct = async () => {
    const products = cart.map((product) => ({
      productId: product._id,
      quantity: product.quantity || 1,
    }));

    const orderData = {
      orderItems: products,
      address: "seyyed colony char darwaza jaipur , Rajsthan",
    };
    console.log(products);

    await createOrder(orderData, token);
    dispatch(resetCart());

    console.log(products);
  };
  return (
    <div className="flex flex-col gap-2 bg-[#161d29] justify-center max-h-[170px] max-w-[200px] w-full p-4 rounded-md border border-[#2C333F] max-[1024px]:mx-auto">
      <p className="opacity-70 text-sm">Total :</p>
      <p className="text-xl font-medium text-yellow-400">Rs {total}</p>
      <IconButton
        text="Buy Now"
        onclick={handleBuyProduct}
        customClasses="w-full justify-center"
      />
    </div>
  );
};

export default RenderTotalAmount;
