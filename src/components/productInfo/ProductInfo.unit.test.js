import { render, screen } from '../../test/utils';
import {
  fakeCurrencies,
  fakeCartProducts,
  fakeShoesProduct,
  fakeIphone12Product,
} from '../../mocks';
import { ProductInfo } from './ProductInfo';

test('should show product info', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  const selectCartProductById = () => null;
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
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
  // selectCartProductById returns null, means the product is not added to cart yet
  const selectCartProductById = () => null;
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Add To Cart button should be in the UI
  const addToCartButtonElement = screen.getByRole('button', {
    name: /Add To Cart/i,
  });
  expect(addToCartButtonElement).toBeInTheDocument();

  // Clicking on the addToCartButtonElement should add product to cart
  await user.click(addToCartButtonElement);
  expect(dispatchProductAddedToCart).toBeCalled();
});

test('increase product count', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[0];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Clicking on the increase count button should increase the count in cart
  const increaseButtonElement = screen.getByRole('button', {
    name: /Increase Count/,
  });
  await user.click(increaseButtonElement);
  expect(dispatchProductEditedInCart).toBeCalled();
});

test('decrease product count', async () => {
  // Prepare initial data and render the component
  const product = fakeIphone12Product;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[1];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Clicking on the decrease count button should decrease the count in cart
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);
  expect(dispatchProductEditedInCart).toBeCalled();
});

test('edit cartProduct selected attribute item', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[0];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Click on an attribute item
  const attributeItemToSelect = product.attributes[0].items[1].value;
  const attributeItemToSelectElement = screen.getByRole('button', {
    name: attributeItemToSelect,
  });
  await user.click(attributeItemToSelectElement);

  // cartProduct should be edited
  expect(dispatchProductEditedInCart).toBeCalled();
});

test('remove product from cart by remove button', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[0];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Remove From Cart button should be in the UI
  const removeFromCartButtonElement = screen.getByRole('button', {
    name: /Remove From Cart/i,
  });
  expect(removeFromCartButtonElement).toBeInTheDocument();

  // Clicking on the removeFromCartButtonElement should remove the product from cart
  await user.click(removeFromCartButtonElement);
  expect(dispatchProductRemovedFromCart).toBeCalled();
});

test('remove product from cart by <Counter />', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[0];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  const { user } = await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
    />
  );

  // Clicking on the decrease count button should remove the product from cart, because count is 1
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);
  expect(dispatchProductRemovedFromCart).toBeCalled();
});

test('dont show description isVerbose prop is false', async () => {
  // Prepare initial data and render the component
  const product = fakeShoesProduct;
  const selectedCurrency = fakeCurrencies[0];
  // selectCartProductById returns a product, means the product is already added to cart
  const selectCartProductById = () => fakeCartProducts[0];
  const dispatchProductAddedToCart = jest.fn();
  const dispatchProductEditedInCart = jest.fn();
  const dispatchProductRemovedFromCart = jest.fn();
  await render(
    <ProductInfo
      product={product}
      selectedCurrency={selectedCurrency}
      selectCartProductById={selectCartProductById}
      dispatchProductAddedToCart={dispatchProductAddedToCart}
      dispatchProductEditedInCart={dispatchProductEditedInCart}
      dispatchProductRemovedFromCart={dispatchProductRemovedFromCart}
      isVerbose={false}
    />
  );

  // Description should not be in the UI
  const descriptionElement = screen.queryByTestId('productInfoDescription');
  expect(descriptionElement).not.toBeInTheDocument();
});
