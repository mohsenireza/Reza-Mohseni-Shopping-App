import { render, screen, within } from '../utils';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  handlers,
  fakeShoesProduct,
  fakeIphone12Product,
  fakeCurrencies,
  fakePs5Product,
  fakeStorageOrderList,
} from '../../mocks';
import App from '../../App';
import { client } from '../../config';
import { storage } from '../../utils';

// Unmock 'react-redux' to ignore the manual mock
jest.unmock('react-redux');

// Config msw to mock APIs
const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(async () => {
  server.resetHandlers();
  // Clear ApolloClient cache
  await client.clearStore();
  // Clear localStorage
  localStorage.clear();
});

afterAll(() => server.close());

test('should load product data', async () => {
  await render(<App />, { route: `/product/${fakeIphone12Product.id}` });

  // The product's data should be in the UI
  expect(screen.getByText(fakeIphone12Product.name)).toBeInTheDocument();
  expect(screen.getByText(fakeIphone12Product.brand)).toBeInTheDocument();
  expect(screen.getByText(fakeIphone12Product.description)).toBeInTheDocument();
});

test('show error when product doesnt get loaded', async () => {
  // Handle 'product' query to response with an error
  server.use(
    graphql.query('product', (req, res, ctx) => {
      return res(ctx.errors);
    })
  );
  await render(<App />, { route: `/product/${fakeIphone12Product.id}` });

  // An error message should be in the UI
  const errorElement = screen.getByRole('heading', {
    name: /please try again later/i,
  });
  expect(errorElement).toBeInTheDocument();

  // The product's data should not be in the UI
  expect(screen.queryByText(fakeIphone12Product.name)).not.toBeInTheDocument();
  expect(screen.queryByText(fakeIphone12Product.brand)).not.toBeInTheDocument();
  expect(
    screen.queryByText(fakeIphone12Product.description)
  ).not.toBeInTheDocument();
});

test('should show the price based on the selected currency', async () => {
  const { user } = await render(<App />, {
    route: `/product/${fakeIphone12Product.id}`,
  });

  const currencyToSelect = fakeCurrencies[1];
  // Click on the currency switcher to open the menu
  await user.click(screen.getByTestId('currencySwitcherHeader'));
  const currencyElement = screen.getByRole('button', {
    name: `${currencyToSelect.symbol} ${currencyToSelect.label}`,
  });
  // Click on the curreny element to change the currency
  await user.click(currencyElement);

  // Product price should be based on the selected currency
  const priceBasedOnSelectedCurrency = fakeIphone12Product.prices.find(
    (price) => price.currency.label === currencyToSelect.label
  ).amount;
  const productPriceElement = screen.getByText(
    `${currencyToSelect.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(productPriceElement).toBeInTheDocument();
});

test('The first image of product should be shown in the bigger img element by default', async () => {
  await render(<App />, { route: `/product/${fakePs5Product.id}` });

  // The bigger img element should show the first image
  expect(screen.getByTestId('productGallerySelectedImage')).toHaveAttribute(
    'src',
    fakePs5Product.gallery[0]
  );
});

test('should select an image to see it in the bigger img element', async () => {
  const { user } = await render(<App />, {
    route: `/product/${fakePs5Product.id}`,
  });

  // Get all image elements
  const imageElements = await within(
    document.querySelector('aside.product__galleryImagesContainer')
  ).findAllByRole('img');

  // Pick one of images to click on it
  const imageElementToSelect = imageElements[imageElements.length - 1];

  // Click on the image element
  await user.click(imageElementToSelect);

  // The bigger img element should show the selected image
  expect(screen.getByTestId('productGallerySelectedImage')).toHaveAttribute(
    'src',
    imageElementToSelect.src
  );
});

test('an out of stock product should have disabled attributes', async () => {
  const { user } = await render(<App />, {
    route: `/product/${fakePs5Product.id}`,
  });

  // Get an attribute item element from UI
  const attributeItemElement = screen.getByRole('button', {
    name: fakePs5Product.attributes[1].items[1].value,
  });

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item should not be selected
  expect(attributeItemElement).not.toHaveClass('-dark');
});

test('an out of stock product should have "OUT OF STOCK" message instead of "Add TO CART" button', async () => {
  await render(<App />, { route: `/product/${fakePs5Product.id}` });

  // Should have 'OUT OF STOCK' message instead of 'ADD TO CART' button
  const addToCartButton = screen.queryByRole('button', { name: 'ADD TO CART' });
  const outOfStockMessage = screen.getByText('OUT OF STOCK');
  expect(addToCartButton).not.toBeInTheDocument();
  expect(outOfStockMessage).toBeInTheDocument();
});

test('add product to cart', async () => {
  // Prepare initial data and render the component
  const { user } = await render(<App />, {
    route: `/product/${fakeShoesProduct.id}`,
  });

  // Click on the ADD TO CART button
  let addToCartButtonElement = screen.getByRole('button', {
    name: /add to cart/i,
  });
  await user.click(addToCartButtonElement);

  // ADD TO CART button should be removed
  addToCartButtonElement = screen.queryByRole('button', {
    name: /add to cart/i,
  });
  expect(addToCartButtonElement).not.toBeInTheDocument();

  // REMOVE FROM CART button should be in the UI
  const removeFromCartButtonElement = screen.queryByRole('button', {
    name: /remove from cart/i,
  });
  expect(removeFromCartButtonElement).toBeInTheDocument();

  // The product should be added to localStorage
  const orderList = storage.load('orderList');
  expect(orderList).toBeTruthy();
  expect(orderList).toHaveLength(1);
  expect(orderList[0].productId).toBe(fakeShoesProduct.id);
});

test('remove product from cart by remove button', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialOrderList = [fakeStorageOrderList[0]];
  storage.save('orderList', initialOrderList);
  const { user } = await render(<App />, {
    route: `/product/${fakeShoesProduct.id}`,
  });

  // Click on the REMOVE FROM CART button
  let removeFromCartButtonElement = screen.getByRole('button', {
    name: /remove from cart/i,
  });
  await user.click(removeFromCartButtonElement);

  // REMOVE FROM CART button should be removed
  removeFromCartButtonElement = screen.queryByRole('button', {
    name: /remove from cart/i,
  });
  expect(removeFromCartButtonElement).not.toBeInTheDocument();

  // ADD TO CART button should be in the UI
  const addToCartButtonElement = screen.queryByRole('button', {
    name: /add to cart/i,
  });
  expect(addToCartButtonElement).toBeInTheDocument();

  // The product should be removed from localStorage
  const orderList = storage.load('orderList');
  expect(orderList).toEqual([]);
});

test('remove product from cart by <Counter />', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialOrderList = [fakeStorageOrderList[0]];
  storage.save('orderList', initialOrderList);
  const { user } = await render(<App />, {
    route: `/product/${fakeShoesProduct.id}`,
  });

  // Click on the decrease count button
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);

  // REMOVE FROM CART button should be removed
  const removeFromCartButtonElement = screen.queryByRole('button', {
    name: /remove from cart/i,
  });
  expect(removeFromCartButtonElement).not.toBeInTheDocument();

  // ADD TO CART button should be in the UI
  const addToCartButtonElement = screen.queryByRole('button', {
    name: /add to cart/i,
  });
  expect(addToCartButtonElement).toBeInTheDocument();

  // The product should be removed from localStorage
  const orderList = storage.load('orderList');
  expect(orderList).toEqual([]);
});

test('increase product count', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialOrderList = [fakeStorageOrderList[0]];
  storage.save('orderList', initialOrderList);
  const { user } = await render(<App />, {
    route: `/product/${fakeShoesProduct.id}`,
  });

  // Click on the increase count button
  const increaseButtonElement = screen.getByRole('button', {
    name: 'Increase Count',
  });
  await user.click(increaseButtonElement);

  // count number in <Counter /> should change
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(2);

  // The product should be updated in localStorage
  const orderList = storage.load('orderList');
  expect(orderList[0].quantity).toBe(2);
});

test('decrease product count', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialOrderList = [{ ...fakeStorageOrderList[0], quantity: 2 }];
  storage.save('orderList', initialOrderList);
  const { user } = await render(<App />, {
    route: `/product/${fakeShoesProduct.id}`,
  });

  // Click on the decrease count button
  const decreaseButtonElement = screen.getByRole('button', {
    name: 'Decrease Count',
  });
  await user.click(decreaseButtonElement);

  // count number in <Counter /> should change
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(1);

  // The product should be updated in localStorage
  const orderList = storage.load('orderList');
  expect(orderList[0].quantity).toBe(1);
});
