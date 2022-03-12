import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../config';
import { currenciesQuery } from '../../graphql/queries';

const initialState = {
  currencies: [],
  status: 'idle',
  error: null,
  selectedCurrency: null,
};

export const fetchCurrencies = createAsyncThunk(
  'currencies/fetchCurrencies',
  async () => {
    try {
      const response = await client.query({ query: currenciesQuery });
      const currencies = response.data.currencies.map((currency) => ({
        label: currency.label,
        symbol: currency.symbol,
      }));
      return currencies;
    } catch (error) {
      console.log(`Error while fetching currencies: ${error}`);
    }
  }
);

const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    currencySelected: (state, action) => {
      state.selectedCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { currencySelected } = currenciesSlice.actions;

export default currenciesSlice.reducer;
