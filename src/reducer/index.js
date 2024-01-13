import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import profileReducer from "../slices/profileSlice";
import productReducer from "../slices/productSlice";
import searchReducer from "../slices/searchProductSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  product: productReducer,
  search: searchReducer
});

export default rootReducer;
