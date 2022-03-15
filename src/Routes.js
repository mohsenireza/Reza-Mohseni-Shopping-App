import { Suspense } from 'react';
import { Routes as AppRoutes, Route } from 'react-router-dom';
import { Products } from './screens';

const Routes = () => {
  return (
    // <Suspense /> handles fallback UI for code splitting and lazy loading
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
      </AppRoutes>
    </Suspense>
  );
};

export { Routes };
