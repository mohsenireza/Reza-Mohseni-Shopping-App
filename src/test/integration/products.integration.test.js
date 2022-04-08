import { render, screen, within, waitForLoadingToFinish } from '../utils';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  handlers,
  fakeCurrencies,
  fakeTechProducts,
  fakeShoesProduct,
  fakeStorageOrderList,
} from '../../mocks';
import { client } from '../../config';
import App from '../../App';
import { modalController, storage } from '../../utils';

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
  // Clear modalRoot
  modalController.deleteModalRoot();
});

afterAll(() => server.close());

test('should fetch categories and show them in the UI', async () => {
  await render(<App />);

  // Fetched categories should be in the UI
  const firstCategory = screen.getByRole('link', { name: 'all' });
  const secondCategory = screen.getByRole('link', { name: 'clothes' });
  const thirdCategory = screen.getByRole('link', { name: 'tech' });
  expect(firstCategory).toBeInTheDocument();
  expect(secondCategory).toBeInTheDocument();
  expect(thirdCategory).toBeInTheDocument();
});

test('should get selected category from URL', async () => {
  await render(<App />, { route: '/products?category=clothes' });

  // The selected category element should have -selected class
  const selectedCategoryElement = screen.getByRole('link', { name: 'clothes' });
  expect(selectedCategoryElement).toHaveClass('-selected');
});

test('should fetch currencies and show them in the UI', async () => {
  const { user } = await render(<App />);

  // Click on the currency selector menu to open it
  await user.click(screen.getByTestId('currencySwitcherHeader'));

  // Fetched currencies should be in the UI
  const firstCurrency = screen.getByRole('button', { name: '$ USD' });
  const secondCurrency = screen.getByRole('button', { name: '£ GBP' });
  const thirdCurrency = screen.getByRole('button', { name: 'A$ AUD' });
  expect(firstCurrency).toBeInTheDocument();
  expect(secondCurrency).toBeInTheDocument();
  expect(thirdCurrency).toBeInTheDocument();
});

test('show error when products dont get loaded', async () => {
  // Handle 'products' query to response with an error
  server.use(
    graphql.query('products', (req, res, ctx) => {
      return res(ctx.errors);
    })
  );
  await render(<App />);

  // An error message should be in the UI
  const errorElement = screen.getByRole('heading', {
    name: /please try again later/i,
  });
  expect(errorElement).toBeInTheDocument();

  // Product cards should not be in the UI
  const productCards = screen.queryAllByRole('article');
  expect(productCards).toHaveLength(0);
});

test('some products should be fetched and rendered when app loads', async () => {
  await render(<App />);

  // Find product cards in the UI
  const productCards = screen.getAllByRole('article');
  productCards.forEach((productCard) =>
    expect(productCard).toBeInTheDocument()
  );
});

test('should fetch products when category changes', async () => {
  const { user } = await render(<App />);

  // Click on a category
  const categoryElement = screen.getByRole('link', {
    name: 'tech',
  });
  await user.click(categoryElement);

  await waitForLoadingToFinish();

  // New products based on the selected category should be rendered
  screen.getByText(new RegExp(fakeTechProducts[0].name));
  screen.getByText(new RegExp(fakeTechProducts[1].name));
});

test('should show price of product cards based on the selected currency', async () => {
  const { user } = await render(<App />);

  const currencyToSelect = fakeCurrencies[1];
  // Click on the currency selector menu to open it
  await user.click(screen.getByTestId('currencySwitcherHeader'));
  // Select a currency
  const currencyElement = screen.getByRole('button', {
    name: `${currencyToSelect.symbol} ${currencyToSelect.label}`,
  });
  await user.click(currencyElement);

  // Each product card should show the price based on the selected currency
  const productCards = screen.getAllByRole('article');
  productCards.forEach((productCard) => {
    const pattern = new RegExp(currencyToSelect.symbol);
    within(productCard).getByText(pattern);
  });
});

test('open cart management modal', async () => {
  // Prepare initial data and render the component
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

  // Now the modal should be opened
  const modalContainerElement = screen.getByTestId('modalContainer');
  expect(modalContainerElement).toBeInTheDocument();
});

test('close cart management modal by clicking on close button', async () => {
  // Prepare initial data and render the component
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

  // Click on the close button to close the modal
  const closeButtonElement = screen.getByTestId(
    'modalContainerContentHeaderCloseButton'
  );
  await user.click(closeButtonElement);

  // Now the modal should be closed
  const modalContainerElement = screen.queryByTestId('modalContainer');
  expect(modalContainerElement).not.toBeInTheDocument();
});

test('add product to cart', async () => {
  // Prepare initial data and render the component
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

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
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

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
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

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
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

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
  const { user } = await render(<App />);

  // Click on cart management button of a <ProductCard /> to open the cart modal
  const cartManagementButtonElement = screen.getAllByRole('button', {
    name: /add product to cart/i,
  })[0];
  await user.click(cartManagementButtonElement);

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
