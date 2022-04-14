import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../config';
import { globalDataQuery } from '../../graphql/queries';

const initialState = {
  categories: [],
  currencies: [],
  selectedCategory: null,
  selectedCurrency: null,
  status: 'idle',
  error: null,
};

export const fetchGlobalData = createAsyncThunk(
  'global/fetchGlobalData',
  async () => {
    try {
      const { data } = await client.query({ query: globalDataQuery() });
      const categories = data.categories.map((category) => category.name);
      const currencies = data.currencies.map((currency) => ({
        label: currency.label,
        symbol: currency.symbol,
      }));
      return { categories, currencies };
    } catch (error) {
      console.log(`Error while fetching global data: ${error}`);
      throw error;
    }
  }
);

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    categorySelected: (state, action) => {
      state.selectedCategory = action.payload;
    },
    selectedCategoryCleared: (state) => {
      state.selectedCategory = null;
    },
    currencySelected: (state, action) => {
      state.selectedCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { currencies, categories } = action.payload;
        state.categories = categories;
        state.currencies = currencies;
      })
      .addCase(fetchGlobalData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { categorySelected, selectedCategoryCleared, currencySelected } =
  globalSlice.actions;

export const selectSelectedCurrency = (state) => state.global.selectedCurrency;

export default globalSlice.reducer;
