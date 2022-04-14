/// <reference types="cypress" />

import { aliasQuery } from '../utils';
import { storage } from '../../src/utils/storage';
import { API_BASE_URL } from '../../src/constants';

describe('products', () => {
  beforeEach(() => {
    // Alias queries
    cy.intercept('POST', API_BASE_URL, (req) => {
      aliasQuery(req, 'GlobalData');
      aliasQuery(req, 'Products');
    });
  });

  it('should load categories', () => {
    cy.visit('/');
    cy.wait('@gqlGlobalDataQuery').then(({ response }) => {
      const { categories } = response.body.data;
      categories.forEach((category) => {
        cy.contains(category.name);
      });
    });
  });

  it('should load currencies', () => {
    cy.visit('/');
    cy.wait('@gqlGlobalDataQuery').then(({ response }) => {
      const { currencies } = response.body.data;
      cy.findByTestId('currencySwitcherHeader').click();
      currencies.forEach((currency) => {
        cy.contains(`${currency.symbol} ${currency.label}`);
      });
    });
  });

  it('should load products', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery').then(({ response }) => {
      const { products } = response.body.data.category;
      products.forEach((product) => {
        cy.contains(product.name);
      });
    });
  });

  it('should show prices based on the selected currency', () => {
    cy.visit('/');
    cy.wait('@gqlGlobalDataQuery').then(({ response }) => {
      const selectedCurrency = response.body.data.currencies[1];
      cy.findByTestId('currencySwitcherHeader').click();
      cy.contains(
        `${selectedCurrency.symbol} ${selectedCurrency.label}`
      ).click();
      cy.wait('@gqlProductsQuery').then(({ response }) => {
        const { products } = response.body.data.category;
        products.forEach((product) => {
          const priceBasedOnSelectedCurrency = product.prices.find(
            (price) => price.currency.label === selectedCurrency.label
          );
          cy.contains(
            `${selectedCurrency.symbol}${priceBasedOnSelectedCurrency.amount}`
          );
        });
      });
    });
  });

  it('should load new products when category changes', () => {
    cy.visit('/');
    cy.wait('@gqlGlobalDataQuery').then(({ response }) => {
      cy.wait('@gqlProductsQuery');
      const categoryToSelect = response.body.data.categories[1];
      cy.contains(categoryToSelect.name).click();
      cy.wait('@gqlProductsQuery').then(({ response }) => {
        const { products } = response.body.data.category;
        products.forEach((product) => {
          cy.contains(product.name);
        });
      });
    });
  });

  it('should add product to cart', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery');
    cy.get('article').first().find('button.productCard__addToCart').click();
    cy.contains('ADD TO CART')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(1);
      });
  });

  it('should increase quantity', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery');
    cy.get('article').first().find('button.productCard__addToCart').click();
    cy.contains('ADD TO CART').click();
    cy.findByTestId('counterIncreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(1);
        expect(orderList[0].quantity).to.eq(2);
      });
  });

  it('should decrease quantity', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery');
    cy.get('article').first().find('button.productCard__addToCart').click();
    cy.contains('ADD TO CART').click();
    cy.findByTestId('counterIncreaseButton').click();
    cy.findByTestId('counterDecreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(1);
        expect(orderList[0].quantity).to.eq(1);
      });
  });

  it('should remove product from cart by <Counter />', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery');
    cy.get('article').first().find('button.productCard__addToCart').click();
    cy.contains('ADD TO CART').click();
    cy.findByTestId('counterDecreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(0);
      });
  });

  it('should remove product from cart by REMOVE button', () => {
    cy.visit('/');
    cy.wait('@gqlProductsQuery');
    cy.get('article').first().find('button.productCard__addToCart').click();
    cy.contains('ADD TO CART').click();
    cy.contains('REMOVE FROM CART')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(0);
      });
  });
});
