import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
  selectedSize: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const category = {cloth:"Clothing",foot:"Footwear"}
      const findProduct = state.cart.find((item) => item._id === product._id);
      const isProductWithSelectedSizeInCart =
        findProduct &&
        state.cart.some(ele => ele.size === state.selectedSize);

      if (isProductWithSelectedSizeInCart) {
        toast.error("Product Already in Cart");
        return;
      }

      if(findProduct && (findProduct.category.name !== category.cloth && findProduct.category.name !== category.foot)){
        toast.error("Product Already in Cart");
        return;
      }

      let productWithQuantity;
      if (product.stock) {
        productWithQuantity = { ...product, quantity: 1 };
      } else {
        productWithQuantity = {
          ...product,
          quantity: 1,
          size: state.selectedSize,
        };
      }

      state.cart.push(productWithQuantity);
      state.totalItems++;
      state.total += product?.price;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Product added to cart");
    },
    
    removeFromCart(state, action) {
      const index = action.payload;

      if (index >= 0) {
        state.totalItems--;
        const totalDecrease =
          state.cart[index].price * state.cart[index].quantity;
        state.total -= totalDecrease;

        let filtered = state.cart.filter((_, i) => i !== index);
        state.cart = filtered;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        toast.success("Removed From Cart");
      }
    },

    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const product = state.cart.find((item) => item._id === productId);
      if (product) {
        const quantityDifference = quantity - product.quantity;
        const totalIncrease = quantityDifference * product.price;

        state.total += totalIncrease;
        product.quantity = quantity;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
      }
    },

    setSelectedSize(state, action) {
      state.selectedSize = action.payload;
    },

    resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  resetCart,
  setSelectedSize,
  updateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
