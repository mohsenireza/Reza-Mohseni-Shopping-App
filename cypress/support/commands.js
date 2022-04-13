import { print } from 'graphql';
import { categoriesQuery, productsQuery } from '../../src/graphql/queries';
import { storage } from '../../src/utils/storage';
import { API_BASE_URL } from '../../src/constants';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Find element by data-testid attribute
Cypress.Commands.add('findByTestId', (testId) => {
  cy.get(`[data-testid=${testId}]`);
});

// Fetch some real products
Cypress.Commands.add('fetchProducts', () => {
  // Fetch categories and get one of them
  cy.request({
    url: API_BASE_URL,
    method: 'POST',
    body: { query: print(categoriesQuery()) },
  }).then(({ body }) => {
    const category = body.data.categories[0].name;
    // Fetch products of selected category and get one of them to use in tests
    cy.request({
      url: API_BASE_URL,
      method: 'POST',
      body: { query: print(productsQuery()), variables: { category } },
    }).then(({ body }) => {
      const products = body.data.category.products;
      return products;
    });
  });
});

// Add a real product to cart
Cypress.Commands.add('addProductToCart', () => {
  cy.fetchProducts().then((products) => {
    const product = products[0];
    const { id: productId, ...productOtherProps } = product;
    const selectedAttributes = product.attributes.map((attribute) => ({
      id: attribute.id,
      selectedItemId: attribute.items[0].id,
    }));
    const storageOrderList = [
      {
        id: '1',
        productId,
        quantity: 1,
        selectedAttributes,
        addedTimestamp: 1649415051362,
      },
    ];
    const orderList = [{ ...storageOrderList[0], ...productOtherProps }];
    storage.save('orderList', storageOrderList);
    return orderList;
  });
});
