import { graphql } from 'msw';
import { storage } from '../utils';
import {
  fakeAllProducts,
  fakeClothesProducts,
  fakeTechProducts,
  fakeCategories,
  fakeCurrencies,
  fakeProducts,
} from './fakeData';

export const handlers = [
  // Handle a 'categories' query
  graphql.query('categories', (req, res, ctx) => {
    return res(
      ctx.data({
        categories: fakeCategories,
      })
    );
  }),

  // Handle a 'currencies' query
  graphql.query('currencies', (req, res, ctx) => {
    return res(
      ctx.data({
        currencies: fakeCurrencies,
      })
    );
  }),

  // Handle a 'products' query
  graphql.query('products', (req, res, ctx) => {
    // Return products based on the category found in request body
    let products = [];
    const category = req.body.variables.category;
    if (category === 'all') products = fakeAllProducts;
    if (category === 'clothes') products = fakeClothesProducts;
    if (category === 'tech') products = fakeTechProducts;

    return res(
      ctx.data({
        category: {
          products,
        },
      })
    );
  }),

  // Handle a 'product' query
  graphql.query('product', (req, res, ctx) => {
    const requestedProduct = fakeProducts.find(
      (fakeProduct) => fakeProduct.id === req.variables.id
    );
    return res(
      ctx.data({
        product: requestedProduct,
      })
    );
  }),

  // Handle a 'cart' query
  graphql.query('cart', (req, res, ctx) => {
    // Send products which their ids are inside localStorage
    const data = {};
    const cartProductList = storage.load('cartProductList');
    cartProductList.forEach((cartProductItem, index) => {
      const product = fakeProducts.find(
        (fakeProduct) => fakeProduct.id === cartProductItem.id
      );
      data[`product${index}`] = product;
    });
    return res(ctx.data(data));
  }),
];
