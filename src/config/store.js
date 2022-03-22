import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import currenciesReducer from '../features/currencies/currenciesSlice';
import productsReducer from '../features/products/productsSlice';
import productReducer from '../features/product/productSlice';

const configureStoreOptions = {
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    products: productsReducer,
    product: productReducer,
  },
};

const store = configureStore(configureStoreOptions);

export { store, configureStoreOptions };
