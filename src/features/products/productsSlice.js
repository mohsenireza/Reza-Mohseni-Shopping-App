import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { client } from '../../config';
import { productsQuery } from '../../graphql/queries';

const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (arg, { getState }) => {
    try {
      const selectedCategory = getState().categories.selectedCategory;
      const response = await client.query({
        query: productsQuery(),
        variables: { category: selectedCategory },
      });
      // Keep just one image of product to improve the performance
      const products = response.data.category.products.map((product) => {
        return {
          ...product,
          gallery: product.gallery.length ? [product.gallery[0]] : [],
        };
      });
      return products;
    } catch (error) {
      console.log(`Error while fetching products: ${error}`);
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        productsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;

export const { selectIds: selectProductIds, selectById: selectProductById } =
  productsAdapter.getSelectors((state) => state.products);
