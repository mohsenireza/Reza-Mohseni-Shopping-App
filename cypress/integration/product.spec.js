/// <reference types="cypress" />

import { aliasQuery } from '../utils';
import { storage } from '../../src/utils/storage';
import { API_BASE_URL } from '../../src/constants';

describe('product', () => {
  // Use this product to test
  let testProduct = null;

  before(() => {
    // get a product to use in tests
    cy.fetchProducts().then((products) => (testProduct = products[0]));
  });

  beforeEach(() => {
    // Alias queries
    cy.intercept('POST', API_BASE_URL, (req) => {
      aliasQuery(req, 'Currencies');
    });
  });

  it('should load product data', () => {
    cy.visit(`/product/${testProduct.id}`);
    cy.contains(testProduct.brand);
    cy.contains(testProduct.name);
    testProduct.attributes.forEach((attribute) => {
      cy.contains(new RegExp(attribute.name, 'i'));
    });
  });

  it('should show price based on the selected category', () => {
    cy.visit(`/product/${testProduct.id}`);
    cy.wait('@gqlCurrenciesQuery').then(({ response }) => {
      const selectedCurrency = response.body.data.currencies[1];
      cy.findByTestId('currencySwitcherHeader').click();
      cy.contains(
        `${selectedCurrency.symbol} ${selectedCurrency.label}`
      ).click();
      const priceBasedOnSelectedCurrency = testProduct.prices.find(
        (price) => price.currency.label === selectedCurrency.label
      );
      cy.contains(
        `${selectedCurrency.symbol}${priceBasedOnSelectedCurrency.amount}`
      );
    });
  });

  it('should add product to cart', () => {
    cy.visit(`/product/${testProduct.id}`);
    cy.contains('ADD TO CART')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(1);
      });
  });

  it('should increase quantity', () => {
    cy.visit(`/product/${testProduct.id}`);
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
    cy.visit(`/product/${testProduct.id}`);
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
    cy.visit(`/product/${testProduct.id}`);
    cy.contains('ADD TO CART').click();
    cy.findByTestId('counterDecreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(0);
      });
  });

  it('should remove product from cart by REMOVE button', () => {
    cy.visit(`/product/${testProduct.id}`);
    cy.contains('ADD TO CART').click();
    cy.contains('REMOVE FROM CART')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(0);
      });
  });
});
