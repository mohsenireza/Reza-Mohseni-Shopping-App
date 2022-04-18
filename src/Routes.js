import { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { StatusView } from './components';
import { Products, Product, Cart } from './screens';

const Routes = () => {
  return (
    // <Suspense /> handles fallback UI for code splitting and lazy loading
    <Suspense fallback={<StatusView type="loading" />}>
      <Switch>
        <Route exact path="/" component={Products} />
        <Route path="/products" component={Products} />
        <Route path="/product/:id" component={Product} />
        <Route path="/cart" component={Cart} />
      </Switch>
    </Suspense>
  );
};

export { Routes };
