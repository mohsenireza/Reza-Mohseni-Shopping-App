/// <reference types="cypress" />

import { storage } from '../../src/utils/storage';

describe('cart', () => {
  // Fill cart with a product to be able to test cart
  let initialOrderList = [];

  beforeEach(() => {
    cy.addProductToCart().then((orderList) => (initialOrderList = orderList));
  });

  it('should show order items', () => {
    cy.visit('/cart');
    const orderItem = initialOrderList[0];
    cy.contains(orderItem.name);
    cy.contains(orderItem.brand);
  });

  it('should increase quantity', () => {
    cy.visit('/cart');
    cy.findByTestId('counterIncreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(1);
        expect(orderList[0].quantity).to.eq(2);
      });
  });

  it('should decrease quantity', () => {
    cy.visit('/cart');
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
    cy.visit('/cart');
    cy.findByTestId('counterDecreaseButton')
      .click()
      .then(() => {
        const orderList = storage.load('orderList');
        expect(orderList).to.have.length(0);
      });
  });

  it('should show a message when cart is empty', () => {
    cy.visit('/cart');
    cy.findByTestId('counterDecreaseButton').click();
    cy.contains(/cart is empty/i);
  });
});
