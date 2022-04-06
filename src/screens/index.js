import { lazy } from 'react';

// Use React.lazy for route based code splitting and lazy loading
export const Products = lazy(() => import('./products/Products'));
export const Product = lazy(() => import('./product/Product'));
export const Cart = lazy(() => import('./cart/Cart'));
