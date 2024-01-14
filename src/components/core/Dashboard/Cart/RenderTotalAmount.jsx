import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../../common/IconButton";
import { createOrder } from "../../../../services/operations/orderApi";
import { resetCart } from "../../../../slices/cartSlice";
import AddressForm from "../../../common/AddressForm";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const [addressModal, setAddressModal] = useState(false);
  const dispatch = useDispatch();

  const handleBuyProduct = () => {
    const products = cart.map((product) => ({
      productId: product._id,
      quantity: product.quantity || 1,
    }));

    setAddressModal({
      btn1Text: "Cancel",
      btn2Text: "Buy",
      btn1Handler: () => setAddressModal(false),
      btn2Handler: async (addressData) =>
        await buyProducts(addressData, products),
    });
  };

  const buyProducts = async (addressData, products) => {
    const { address, city, pincode, state, country } = addressData;
    const orderData = {
      orderItems: products,
      address: `${address}, ${city}, ${pincode},${state}, ${country}`,
    };

    await createOrder(orderData, token);
    dispatch(resetCart());
    setAddressModal(false)
  };

  return (
    <>
      <div className="flex flex-col gap-2 bg-[#161d29] justify-center max-h-[170px] max-w-[200px] w-full p-4 rounded-md border border-[#2C333F] max-[1024px]:mx-auto">
        <p className="opacity-70 text-sm">Total :</p>
        <p className="text-xl font-medium text-yellow-400">Rs {total}</p>
        <IconButton
          text="Buy Now"
          onclick={handleBuyProduct}
          customClasses="w-full justify-center"
        />
      </div>
      {addressModal && <AddressForm modalData={addressModal} />}
    </>
  );
};

export default RenderTotalAmount;
