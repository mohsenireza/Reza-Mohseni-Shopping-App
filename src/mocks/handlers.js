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
  // Handle a 'GlobalData' query
  graphql.query('GlobalData', (req, res, ctx) => {
    return res(
      ctx.data({
        categories: fakeCategories,
        currencies: fakeCurrencies,
      })
    );
  }),

  // Handle a 'Products' query
  graphql.query('Products', (req, res, ctx) => {
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

  // Handle a 'Product' query
  graphql.query('Product', (req, res, ctx) => {
    const requestedProduct = fakeProducts.find(
      (fakeProduct) => fakeProduct.id === req.variables.id
    );
    return res(
      ctx.data({
        product: requestedProduct,
      })
    );
  }),

  // Handle a 'Cart' query
  graphql.query('Cart', (req, res, ctx) => {
    // Send products which their ids are inside localStorage
    const data = {};
    const orderList = storage.load('orderList');
    orderList.forEach((orderItem, index) => {
      const product = fakeProducts.find(
        (fakeProduct) => fakeProduct.id === orderItem.productId
      );
      data[`product${index}`] = product;
    });
    return res(ctx.data(data));
  }),
];
