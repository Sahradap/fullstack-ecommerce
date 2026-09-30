import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { create } from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/products/");
        console.log("Products API response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Complete error:", error);
      console.log("Error message:", error.message);
      console.log("Error status:", error.response?.status);
      console.log("Error response:", error.response?.data);

      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch products."
      );
    }
  }
);
export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async(productId,thunkAPI) =>{
        try{
            const response = await axiosInstance.get(`/products/${productId}/`);
            return response.data;
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.error || "failed to fetch product");
        }
    }
);

const initialState ={
    products:[],
    selectedProduct:null,
    loading:false,
    error:null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers:{
        clearSelectedProduct:(state)=>{
            state.selectedProduct=null;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
          .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.loading = false;
            state.products = action.payload;
            state.error = null;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchProductById.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.selectedProduct=null;
        })
        .addCase(fetchProductById.fulfilled,(state,action)=>{
            state.loading = false;
            state.selectedProduct = action.payload;
            state.error = null;
        })
         .addCase(fetchProductById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        });

    },
});

export const {clearSelectedProduct} = productSlice.actions;
export default productSlice.reducer;