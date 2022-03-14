import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import currenciesReducer from '../features/currencies/currenciesSlice';
import productsReducer from '../features/products/productsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    products: productsReducer,
  },
});

export { store };
