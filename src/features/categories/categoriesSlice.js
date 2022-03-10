import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../config';
import { categoriesQuery } from '../../graphql/queries';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
  selectedCategory: '',
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    try {
      const response = await client.query({ query: categoriesQuery });
      const categories = response.data.categories.map(
        (category) => category.name
      );
      return categories;
    } catch (error) {
      console.log(`Error while fetching categories: ${error}`);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categorySelected: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { categorySelected } = categoriesSlice.actions;

export default categoriesSlice.reducer;
