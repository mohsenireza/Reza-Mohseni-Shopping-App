/// <reference types="cypress" />

import { storage } from '../../src/utils/storage';

describe('miniCart', () => {
  // Fill cart with a product to be able to test cart
  let initialOrderList = [];

  beforeEach(() => {
    cy.addProductToCart().then((orderList) => (initialOrderList = orderList));
  });

  it('should show total cart item quantity with a badge', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').within(() => {
      cy.contains(1);
    });
  });

  it('should show order items', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').click();
    cy.findByTestId('miniCartOverlay').within(() => {
      const orderItem = initialOrderList[0];
      cy.contains(orderItem.name);
      cy.contains(orderItem.brand);
    });
  });

  it('should show total cart item quantity inside the overlay', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').click();
    cy.findByTestId('miniCartOverlay').within(() => {
      cy.contains(/1 item/i);
    });
  });

  it('should increase quantity', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').click();
    cy.findByTestId('miniCartOverlay').within(() => {
      cy.findByTestId('counterIncreaseButton')
        .click()
        .then(() => {
          const orderList = storage.load('orderList');
          expect(orderList).to.have.length(1);
          expect(orderList[0].quantity).to.eq(2);
        });
    });
  });

  it('should decrease quantity', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').click();
    cy.findByTestId('miniCartOverlay').within(() => {
      cy.findByTestId('counterIncreaseButton').click();
      cy.findByTestId('counterDecreaseButton')
        .click()
        .then(() => {
          const orderList = storage.load('orderList');
          expect(orderList).to.have.length(1);
          expect(orderList[0].quantity).to.eq(1);
        });
    });
  });

  it('should remove product from cart by <Counter />', () => {
    cy.visit('/');
    cy.findByTestId('miniCartHeader').click();
    cy.findByTestId('miniCartOverlay').within(() => {
      cy.findByTestId('counterDecreaseButton')
        .click()
        .then(() => {
          const orderList = storage.load('orderList');
          expect(orderList).to.have.length(0);
        });
    });
  });
});
