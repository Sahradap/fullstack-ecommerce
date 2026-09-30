import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",

  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/cart/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to load cart",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",

  async (cartData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/cart/", cartData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "failed to add product to cart",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/cart/${cartItemId}/`);
      return { cartItemId, message: response.data.message };
    } catch (error) {
      console.log("Remove error:", error);
      console.log("Remove status:", error.response?.status);
      console.log("Remove response:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "failed to remover product from cart",
      );
    }
  },
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/cart/${cartItemId}/`, {
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "failed to update cart quantity",
      );
    }
  },
);

const initialState = {
  items: [],
  cartTotal: 0,
  loading: false,
  removingId: null,
  error: null,
  message: null,
  updatingId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    clearCartMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.cartTotal = 0;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch cart

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.cartTotal = action.payload.cart_total || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.message = "Product added to cart";
        state.error = null;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //remove from cart

      .addCase(removeFromCart.pending, (state, action) => {
        state.removingId = action.meta.arg;

        state.error = null;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removingId = null;

        state.items = state.items.filter(
          (item) => item.id !== action.payload.cartItemId,
        );

        state.cartTotal = state.items.reduce(
          (total, item) => total + Number(item.item_total),
          0,
        );

        state.message = action.payload.message || "Product removed from cart";

        state.error = null;
      })

      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingId = null;
        state.error = action.payload;
      })

      //update cart

      .addCase(updateCartQuantity.pending, (state, action) => {
        state.updatingId = action.meta.arg.cartItemId;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.updatingId = null;

        const updatedItem = action.payload;

        const itemIndex = state.items.findIndex(
          (item) => item.id === updatedItem.id,
        );

        if (itemIndex !== -1) {
          state.items[itemIndex] = updatedItem;
        }

        state.cartTotal = state.items.reduce(
          (total, item) => total + Number(item.item_total),
          0,
        );

        state.error = null;
      })

      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.updatingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearCartMessage, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
