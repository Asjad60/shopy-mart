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
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const findProduct = state.cart.find((item) => item._id === product._id);
      if (findProduct) {
        if (findProduct.stock === findProduct.quantity) return;
        findProduct.quantity++;
        state.total += product?.price;
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        return;
      }

      const productWithQuantity = { ...product, quantity: 1 };

      state.cart.push(productWithQuantity);
      state.totalItems++;
      state.total += product?.price;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Product added to cart");
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      const index = state.cart.findIndex((item) => item._id === productId);

      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        let filtered = state.cart.filter((item) => item._id !== action.payload);
        state.cart = filtered;
        localStorage.removeItem("cart", JSON.stringify(state.cart));
        localStorage.removeItem("total", JSON.stringify(state.total));
        localStorage.removeItem("totalItems", JSON.stringify(state.totalItems));

        toast.success("Removed From Cart");
      }
    },

    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const product = state.cart.find((item) => item._id === productId);
      if (product) {
        state.total += (quantity - product.quantity) * product.price;
        product.quantity = quantity;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
      }
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

export const { addToCart, removeFromCart, resetCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
