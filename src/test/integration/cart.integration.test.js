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
  await render(<App />, { route: '/cart' });

  // Brand should be in the UI
  const brandElement = screen.getByRole('link', {
    name: fakeShoesProduct.brand,
  });
  expect(brandElement).toBeInTheDocument();

  // Name should be in the UI
  const nameElement = screen.getByRole('link', {
    name: fakeShoesProduct.name,
  });
  expect(nameElement).toBeInTheDocument();

  // Price based on the selected category should be in the UI
  const defaultSelectedCurrency = fakeCurrencies[0];
  const priceBasedOnSelectedCurrency = fakeShoesProduct.prices.find(
    (price) => price.currency.label === defaultSelectedCurrency.label
  ).amount;
  const cartProductElement = screen.getByRole('article');
  const priceElement = within(cartProductElement).getByText(
    `${defaultSelectedCurrency.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(priceElement).toBeInTheDocument();

  // All attribute items should be in the UI
  fakeShoesProduct.attributes.forEach((attribute) => {
    attribute.items.forEach((attributeItem) => {
      const attributeItemElement = screen.getByRole('button', {
        name: attributeItem.value,
      });
      expect(attributeItemElement).toBeInTheDocument();
    });
  });

  // Selected attribute item should be dark
  const selectedAttributeItemElement = screen.getByRole('button', {
    name: '40',
  });
  expect(selectedAttributeItemElement).toHaveClass('-dark');

  // Count should be in the UI
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(1);

  // An image of product should be in the UI
  const productImageElement = screen.getByRole('img', {
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
  const { user } = await render(<App />, { route: '/cart' });

  // Click on the decrease count button
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');
  await user.click(decreaseButtonElement);

  // The cartProduct should be removed
  const cartProductElement = screen.queryByRole('article');
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
  const { user } = await render(<App />, { route: '/cart' });

  // Click on the increase count button
  const increaseButtonElement = screen.getByRole('button', {
    name: 'Increase Count',
  });
  await user.click(increaseButtonElement);

  // count number in <Counter /> should change
  const countElement = screen.getByTestId('counterCount');
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
  const { user } = await render(<App />, { route: '/cart' });

  // Click on the decrease count button
  const decreaseButtonElement = screen.getByRole('button', {
    name: 'Decrease Count',
  });
  await user.click(decreaseButtonElement);

  // count number in <Counter /> should change
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(1);

  // The product should be updated in localStorage
  const cartProductList = storage.load('cartProductList');
  expect(cartProductList[0].count).toBe(1);
});

test('show next and prev product image', async () => {
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
  const { user } = await render(<App />, { route: '/cart' });

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 2 image of product should be visible
  const imageElement = screen.getByRole('img', {
    name: `${fakeShoesProduct.brand} - ${fakeShoesProduct.name}`,
  });
  expect(imageElement.src).toBe(fakeShoesProduct.gallery[1]);

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the 1 image of product should be visible
  expect(imageElement.src).toBe(fakeShoesProduct.gallery[0]);
});

test('loop through product images when reaches to the first or last image', async () => {
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
  const { user } = await render(<App />, { route: '/cart' });

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the last image of product should be visible
  const imageElement = screen.getByRole('img', {
    name: `${fakeShoesProduct.brand} - ${fakeShoesProduct.name}`,
  });
  expect(imageElement.src).toBe(
    fakeShoesProduct.gallery[fakeShoesProduct.gallery.length - 1]
  );

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 1 image of product should be visible
  expect(imageElement.src).toBe(fakeShoesProduct.gallery[0]);
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
  await render(<App />, { route: '/cart' });

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
  const totalPriceElement = screen.getByText(
    `${defaultSelectedCurrency.symbol}${roundedTotalPrice}`
  );
  expect(totalPriceElement).toBeInTheDocument();
});
