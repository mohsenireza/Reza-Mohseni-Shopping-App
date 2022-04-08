import { render, screen } from '../../test/utils';
import {
  fakeCurrencies,
  fakeShoesProduct,
  fakeIphone12Product,
  fakeOrderList,
} from '../../mocks';
import { ProductInfo } from './ProductInfo';

test('should show product info', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  const selectOrderItemByProduct = () => null;
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Brand should be in the UI
  const brandElement = screen.getByText(product.brand);
  expect(brandElement).toBeInTheDocument();

  // Name should be in the UI
  const nameElement = screen.getByText(product.name);
  expect(nameElement).toBeInTheDocument();

  // All attributes and attribute items should be in the UI
  product.attributes.forEach((attribute) => {
    const attributeNameElement = screen.getByText(
      `${attribute.name.toUpperCase()}:`
    );
    expect(attributeNameElement).toBeInTheDocument();
  });

  // Price based on the selected category should be in the UI
  const priceBasedOnSelectedCurrency = product.prices.find(
    (price) => price.currency.label === selectedCurrency.label
  ).amount;
  const priceElement = screen.getByText(
    `${selectedCurrency.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(priceElement).toBeInTheDocument();

  // Description should be in the UI
  const descriptionElement = screen.getByTestId('productInfoDescription');
  expect(descriptionElement.innerHTML).toBe(product.description);
});

test('add product to cart', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns null, means the product is not added to cart yet
  const selectOrderItemByProduct = () => null;
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Add To Cart button should be in the UI
  const addToCartButtonElement = screen.getByRole('button', {
    name: /Add To Cart/i,
  });
  expect(addToCartButtonElement).toBeInTheDocument();

  // Clicking on the addToCartButtonElement should add product to cart
  await user.click(addToCartButtonElement);
  expect(dispatchOrderItemAdded).toBeCalled();
});

test('increase product count', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns a product, means the product is already added to cart
  const selectOrderItemByProduct = () => fakeOrderList[0];
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Clicking on the increase count button should increase the count in cart
  const increaseButtonElement = screen.getByRole('button', {
    name: /Increase Count/,
  });
  await user.click(increaseButtonElement);
  expect(dispatchOrderItemQuantityEdited).toBeCalled();
});

test('decrease product count', async () => {
  // Prepare initial data and render the component
  const product = fakeIphone12Product;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns a product, means the product is already added to cart
  const selectOrderItemByProduct = () => fakeOrderList[1];
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Clicking on the decrease count button should decrease the count in cart
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);
  expect(dispatchOrderItemQuantityEdited).toBeCalled();
});

test('remove product from cart by remove button', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns a product, means the product is already added to cart
  const selectOrderItemByProduct = () => fakeOrderList[0];
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Remove From Cart button should be in the UI
  const removeFromCartButtonElement = screen.getByRole('button', {
    name: /Remove From Cart/i,
  });
  expect(removeFromCartButtonElement).toBeInTheDocument();

  // Clicking on the removeFromCartButtonElement should remove the product from cart
  await user.click(removeFromCartButtonElement);
  expect(dispatchOrderItemRemoved).toBeCalled();
});

test('remove product from cart by <Counter />', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns a product, means the product is already added to cart
  const selectOrderItemByProduct = () => fakeOrderList[0];
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
    />
  );

  // Clicking on the decrease count button should remove the product from cart, because count is 1
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);
  expect(dispatchOrderItemRemoved).toBeCalled();
});

test('dont show description isVerbose prop is false', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectOrderItemByProduct returns a product, means the product is already added to cart
  const selectOrderItemByProduct = () => fakeOrderList[0];
  const dispatchOrderItemAdded = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const dispatchOrderItemRemoved = jest.fn();
  await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectOrderItemByProduct={selectOrderItemByProduct}
      dispatchOrderItemAdded={dispatchOrderItemAdded}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      isVerbose={false}
    />
  );

  // Description should not be in the UI
  const descriptionElement = screen.queryByTestId('productInfoDescription');
  expect(descriptionElement).not.toBeInTheDocument();
});
