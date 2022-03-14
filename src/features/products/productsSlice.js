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
    const selectedCategory = getState().categories.selectedCategory;
    const response = await client.query({
      query: productsQuery({ category: selectedCategory }),
    });
    return response.data.category.products;
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
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default productsSlice.reducer;

export const { selectIds: selectProductIds, selectById: selectProductById } =
  productsAdapter.getSelectors((state) => state.products);
