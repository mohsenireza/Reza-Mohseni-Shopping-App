import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import currenciesReducer from '../features/currencies/currenciesSlice';
import productsReducer from '../features/products/productsSlice';
import productReducer from '../features/product/productSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    products: productsReducer,
    product: productReducer,
  },
});

export { store };
