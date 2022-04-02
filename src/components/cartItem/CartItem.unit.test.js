import { render, screen } from '../../test/utils';
import { fakeCartProducts, fakeCurrencies } from '../../mocks';
import { CartItem } from './CartItem';

test('should render data', async () => {
  // Prepare initial data and render the component
  const cartProduct = fakeCartProducts[0];
  const selectedCurrency = fakeCurrencies[0];
  await render(
    <CartItem
      id={cartProduct.id}
      selectCartProductById={() => cartProduct}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchProductRemovedFromCart={() => {}}
      dispatchProductEditedInCart={() => {}}
    />
  );

  // Brand should be in the UI
  const brandElement = screen.getByRole('link', { name: cartProduct.brand });
  expect(brandElement).toBeInTheDocument();

  // Name should be in the UI
  const nameElement = screen.getByRole('link', { name: cartProduct.name });
  expect(nameElement).toBeInTheDocument();

  // Price based on the selected category should be in the UI
  const priceBasedOnSelectedCurrency = cartProduct.prices.find(
    (price) => price.currency.label === selectedCurrency.label
  ).amount;
  const priceElement = screen.getByText(
    `${selectedCurrency.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(priceElement).toBeInTheDocument();

  // All attribute items should be in the UI
  cartProduct.attributes.forEach((attribute) => {
    attribute.items.forEach((attributeItem) => {
      const attributeItemElement = screen.getByRole('button', {
        name: attributeItem.value,
      });
      expect(attributeItemElement).toBeInTheDocument();
    });
  });

  // Selected attribute items should have a different UI
  for (const key in cartProduct.selectedAttributes) {
    if (Object.hasOwnProperty.call(cartProduct.selectedAttributes, key)) {
      const selectedAttributeItem = cartProduct.selectedAttributes[key];
      const selectedAttributeItemElement = screen.getByRole('button', {
        name: selectedAttributeItem,
      });
      expect(selectedAttributeItemElement).toHaveClass('-dark');
    }
  }

  // Count should be in the UI
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(cartProduct.count);

  // An image of product should be in the UI
  const productImageElement = screen.getByRole('img', {
    name: `${cartProduct.brand} - ${cartProduct.name}`,
  });
  expect(productImageElement).toBeInTheDocument();
});

test('should be able to remove the product', async () => {
  // Prepare initial data and render the component
  const cartProduct = fakeCartProducts[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchProductRemovedFromCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const { user } = await render(
    <CartItem
      id={cartProduct.id}
      selectCartProductById={() => cartProduct}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
    />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'dispatchProductRemovedFromCart' should be called
  expect(dispatchProductRemovedFromCart).toBeCalledTimes(1);
});

test('should be able to increase the product count', async () => {
  // Prepare initial data and render the component
  const cartProduct = fakeCartProducts[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchProductRemovedFromCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const { user } = await render(
    <CartItem
      id={cartProduct.id}
      selectCartProductById={() => cartProduct}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
    />
  );

  // Find the increase count button
  const increaseButtonElement = screen.getByRole('button', {
    name: 'Increase Count',
  });

  // Click on the increase count button
  await user.click(increaseButtonElement);

  // 'dispatchProductEditedInCart' should be called
  expect(dispatchProductEditedInCart).toBeCalledTimes(1);
});

test('should be able to decrease the product count', async () => {
  // Prepare initial data and render the component
  const cartProduct = fakeCartProducts[1];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchProductRemovedFromCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const { user } = await render(
    <CartItem
      id={cartProduct.id}
      selectCartProductById={() => cartProduct}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
    />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByRole('button', {
    name: 'Decrease Count',
  });

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'dispatchProductEditedInCart' should be called
  expect(dispatchProductEditedInCart).toBeCalledTimes(1);
});
