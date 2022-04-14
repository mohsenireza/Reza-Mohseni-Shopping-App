import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../features/global/globalSlice';
import productsReducer from '../features/products/productsSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';

const configureStoreOptions = {
  reducer: {
    global: globalReducer,
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
  },
};

const store = configureStore(configureStoreOptions);

export { store, configureStoreOptions };
