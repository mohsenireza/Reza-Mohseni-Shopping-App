import { Suspense } from 'react';
import { Routes as AppRoutes, Route } from 'react-router-dom';
import { StatusView } from './components';
import { Products, Product, Cart } from './screens';

const Routes = () => {
  return (
    // <Suspense /> handles fallback UI for code splitting and lazy loading
    <Suspense fallback={<StatusView type="loading" />}>
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
