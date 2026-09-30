import { configureStore } from "@reduxjs/toolkit";

import productReducer from "../features/products/productSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice"
import orderReducer from "../features/orders/orderSlice"

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth:authReducer,
    cart:cartReducer,
    orders:orderReducer,
  },
});