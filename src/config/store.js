import { configureStore } from '@reduxjs/toolkit';
import categoriesSlice from '../features/categories/categoriesSlice';
import currenciesSlice from '../features/currencies/currenciesSlice';

const store = configureStore({
  reducer: {
    categories: categoriesSlice,
    currencies: currenciesSlice,
  },
});

export { store };
