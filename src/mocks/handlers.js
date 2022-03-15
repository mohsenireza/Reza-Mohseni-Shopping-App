import { graphql } from 'msw';
import {
  fakeAllProducts,
  fakeClothesProducts,
  fakeTechProducts,
  fakeCategories,
  fakeCurrencies,
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
];
