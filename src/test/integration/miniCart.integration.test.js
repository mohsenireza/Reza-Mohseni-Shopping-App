import { render, screen, within } from '../utils';
import { setupServer } from 'msw/node';
import {
  handlers,
  fakeIphone12Product,
  fakeCurrencies,
  fakeShoesProduct,
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

test('miniCart badge should show total cart item quantity', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
    {
      id: fakeIphone12Product.id,
      selectedAttributes: { Capacity: '512G' },
      count: 2,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  await render(<App />);

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Badge with a correct number should be in the UI
  const badge = withinMiniCart.getByText('3');
  expect(badge).toBeInTheDocument();
});

test('load cartProducts', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // totalCartItemQuantity should be in the UI
  const totalCountElement = withinMiniCart.getByRole('heading', {
    name: /1 item/,
  });
  expect(totalCountElement).toBeInTheDocument();

  // Brand should be in the UI
  const brandElement = withinMiniCart.getByRole('link', {
    name: fakeShoesProduct.brand,
  });
  expect(brandElement).toBeInTheDocument();

  // Name should be in the UI
  const nameElement = withinMiniCart.getByRole('link', {
    name: fakeShoesProduct.name,
  });
  expect(nameElement).toBeInTheDocument();

  // Price based on the selected category should be in the UI
  const defaultSelectedCurrency = fakeCurrencies[0];
  const priceBasedOnSelectedCurrency = fakeShoesProduct.prices.find(
    (price) => price.currency.label === defaultSelectedCurrency.label
  ).amount;
  const cartProductElement = withinMiniCart.getByRole('article');
  const priceElement = within(cartProductElement).getByText(
    `${defaultSelectedCurrency.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(priceElement).toBeInTheDocument();

  // All attribute items should be in the UI
  fakeShoesProduct.attributes.forEach((attribute) => {
    attribute.items.forEach((attributeItem) => {
      const attributeItemElement = withinMiniCart.getByRole('button', {
        name: attributeItem.value,
      });
      expect(attributeItemElement).toBeInTheDocument();
    });
  });

  // Selected attribute item should be light
  const selectedAttributeItemElement = withinMiniCart.getByRole('button', {
    name: '40',
  });
  expect(selectedAttributeItemElement).toHaveClass('-light');

  // Count should be in the UI
  const countElement = withinMiniCart.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(1);

  // An image of product should be in the UI
  const productImageElement = withinMiniCart.getByRole('img', {
    name: `${fakeShoesProduct.brand} - ${fakeShoesProduct.name}`,
  });
  expect(productImageElement).toBeInTheDocument();
});

test('remove product from cart by <Counter />', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Click on the decrease count button
  const decreaseButtonElement = withinMiniCart.getByTestId(
    'counterDecreaseButton'
  );
  await user.click(decreaseButtonElement);

  // The cartProduct should be removed
  const cartProductElement = withinMiniCart.queryByRole('article');
  expect(cartProductElement).not.toBeInTheDocument();

  // The product should be removed from localStorage
  const cartProductList = storage.load('cartProductList');
  expect(cartProductList).toEqual([]);
});

test('increase product count', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Click on the increase count button
  const increaseButtonElement = withinMiniCart.getByRole('button', {
    name: 'Increase Count',
  });
  await user.click(increaseButtonElement);

  // count number in <Counter /> should change
  const countElement = withinMiniCart.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(2);

  // The product should be updated in localStorage
  const cartProductList = storage.load('cartProductList');
  expect(cartProductList[0].count).toBe(2);
});

test('decrease product count', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 2,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Click on the decrease count button
  const decreaseButtonElement = withinMiniCart.getByRole('button', {
    name: 'Decrease Count',
  });
  await user.click(decreaseButtonElement);

  // count number in <Counter /> should change
  const countElement = withinMiniCart.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(1);

  // The product should be updated in localStorage
  const cartProductList = storage.load('cartProductList');
  expect(cartProductList[0].count).toBe(1);
});

test('show total price', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
    {
      id: fakeIphone12Product.id,
      selectedAttributes: { Capacity: '512G' },
      count: 2,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Price based on the selected category should be in the UI
  const defaultSelectedCurrency = fakeCurrencies[0];
  const shoesPrice = fakeShoesProduct.prices.find(
    (price) => price.currency.label === defaultSelectedCurrency.label
  ).amount;
  const iphonePrice = fakeIphone12Product.prices.find(
    (price) => price.currency.label === defaultSelectedCurrency.label
  ).amount;
  const totalPrice = shoesPrice + iphonePrice * 2;
  const roundedTotalPrice = Number.parseFloat(totalPrice).toFixed(2);
  const totalPriceElement = withinMiniCart.getByText(
    `${defaultSelectedCurrency.symbol}${roundedTotalPrice}`
  );
  expect(totalPriceElement).toBeInTheDocument();
});

test('VIEW BAG button navigates to /cart page', async () => {
  // Prepare initial data and render the component
  // Add a product to cart by adding it to localStorage
  const initialCartProductList = [
    {
      id: fakeShoesProduct.id,
      selectedAttributes: { Size: '40' },
      count: 1,
    },
  ];
  storage.save('cartProductList', initialCartProductList);
  const { user } = await render(<App />);

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByTestId('miniCartHeader');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Get miniCart to query elements inside it
  const withinMiniCart = within(screen.getByTestId('miniCart'));

  // Click on the VIEW BAG button
  const viewBagButton = withinMiniCart.getByRole('button', {
    name: /view bag/i,
  });
  await user.click(viewBagButton);

  // Now we should be in the /cart page
  expect(window.location.pathname).toBe('/cart');
});
