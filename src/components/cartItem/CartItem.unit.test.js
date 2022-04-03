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

  // Count should be in the UI
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(cartProduct.count);

  // An image of product should be in the UI
  const productImageElement = screen.getByRole('img', {
    name: `${cartProduct.brand} - ${cartProduct.name}`,
  });
  expect(productImageElement).toBeInTheDocument();
});

test('selected attribute items are dark when size prop is big', async () => {
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

  // Selected attribute items should be dark
  for (const key in cartProduct.selectedAttributes) {
    if (Object.hasOwnProperty.call(cartProduct.selectedAttributes, key)) {
      const selectedAttributeItem = cartProduct.selectedAttributes[key];
      const selectedAttributeItemElement = screen.getByRole('button', {
        name: selectedAttributeItem,
      });
      expect(selectedAttributeItemElement).toHaveClass('-dark');
    }
  }
});

test('selected attribute items are light when size prop is small', async () => {
  // Prepare initial data and render the component
  const cartProduct = fakeCartProducts[0];
  const selectedCurrency = fakeCurrencies[0];
  await render(
    <CartItem
      id={cartProduct.id}
      selectCartProductById={() => cartProduct}
      selectedCurrency={selectedCurrency}
      size="small"
      dispatchProductRemovedFromCart={() => {}}
      dispatchProductEditedInCart={() => {}}
    />
  );

  // Selected attribute items should be light
  for (const key in cartProduct.selectedAttributes) {
    if (Object.hasOwnProperty.call(cartProduct.selectedAttributes, key)) {
      const selectedAttributeItem = cartProduct.selectedAttributes[key];
      const selectedAttributeItemElement = screen.getByRole('button', {
        name: selectedAttributeItem,
      });
      expect(selectedAttributeItemElement).toHaveClass('-light');
    }
  }
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

test('show next and prev product image', async () => {
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

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 2 image of product should be visible
  const imageElement = screen.getByRole('img', {
    name: `${cartProduct.brand} - ${cartProduct.name}`,
  });
  expect(imageElement.src).toBe(cartProduct.gallery[1]);

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the 1 image of product should be visible
  expect(imageElement.src).toBe(cartProduct.gallery[0]);
});

test('loop through images when reaches to the first or last image', async () => {
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

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the last image of product should be visible
  const imageElement = screen.getByRole('img', {
    name: `${cartProduct.brand} - ${cartProduct.name}`,
  });
  expect(imageElement.src).toBe(
    cartProduct.gallery[cartProduct.gallery.length - 1]
  );

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 1 image of product should be visible
  expect(imageElement.src).toBe(cartProduct.gallery[0]);
});
