import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createOrder = createAsyncThunk(
  "orders/createOrder",

  async (orderData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/orders/create/", orderData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "failed to place order",
      );
    }
  },
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/orders/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "failed to load orders",
      );
    }
  },
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //create order

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      })

      // Fetch order history
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
