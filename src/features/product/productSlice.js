import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../config';
import { productQuery } from '../../graphql/queries';

const initialState = {
  product: null,
  status: 'idle',
  error: null,
  selectedImage: null,
};

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id) => {
    try {
      const response = await client.query({
        query: productQuery(),
        variables: { id },
      });
      return response.data.product;
    } catch (error) {
      console.log(`Error while fetching product: ${error}`);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    imageSelected: (state, action) => {
      state.selectedImage = action.payload;
    },
    productStateCleared: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        const product = action.payload;
        state.product = product;
        if (product.gallery.length) state.selectedImage = product.gallery[0];
        state.status = 'succeeded';
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'failed';
      });
  },
});

export const { imageSelected, productStateCleared } = productSlice.actions;

export default productSlice.reducer;
