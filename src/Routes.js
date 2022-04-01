import { Suspense } from 'react';
import { Routes as AppRoutes, Route } from 'react-router-dom';
import { Products, Product, Cart } from './screens';

const Routes = () => {
  return (
    // <Suspense /> handles fallback UI for code splitting and lazy loading
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
      </AppRoutes>
    </Suspense>
  );
};

export { Routes };
