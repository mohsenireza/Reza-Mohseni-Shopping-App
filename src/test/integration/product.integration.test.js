import { render, screen, within } from '../utils';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  handlers,
  fakeIphone12Product,
  fakeCurrencies,
  fakePs5Product,
} from '../../mocks';
import App from '../../App';
import { client } from '../../config';

// Unmock 'react-redux' to ignore the manual mock
jest.unmock('react-redux');

// Config msw to mock APIs
const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(async () => {
  server.resetHandlers();
  // Clear ApolloClient cache
  await client.clearStore();
});

afterAll(() => server.close());

test('should load product data', async () => {
  await render(<App />, { route: '/product/id' });

  // The product's data should be in the UI
  expect(screen.getByText(fakeIphone12Product.name)).toBeInTheDocument();
  expect(screen.getByText(fakeIphone12Product.brand)).toBeInTheDocument();
  expect(screen.getByText(fakeIphone12Product.description)).toBeInTheDocument();
});

test('should show the price based on the selected currency', async () => {
  const { user } = await render(<App />, { route: '/product/id' });

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
  // Handle 'product' query to response with 'fakePs5Product' data
  server.use(
    graphql.query('product', (req, res, ctx) => {
      return res(
        ctx.data({
          product: fakePs5Product,
        })
      );
    })
  );

  await render(<App />, { route: '/product/id' });

  // The bigger img element should show the first image
  expect(screen.getByTestId('productGallerySelectedImage')).toHaveAttribute(
    'src',
    fakePs5Product.gallery[0]
  );
});

test('should select an image to see it in the bigger img element', async () => {
  // Handle 'product' query to response with 'fakePs5Product' data
  server.use(
    graphql.query('product', (req, res, ctx) => {
      return res(
        ctx.data({
          product: fakePs5Product,
        })
      );
    })
  );

  const { user } = await render(<App />, { route: '/product/id' });

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
  // Handle 'product' query to response with 'fakePs5Product' data
  server.use(
    graphql.query('product', (req, res, ctx) => {
      return res(
        ctx.data({
          product: fakePs5Product,
        })
      );
    })
  );

  const { user } = await render(<App />, { route: '/product/id' });

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
  // Handle 'product' query to response with 'fakePs5Product' data
  server.use(
    graphql.query('product', (req, res, ctx) => {
      return res(
        ctx.data({
          product: fakePs5Product,
        })
      );
    })
  );

  await render(<App />, { route: '/product/id' });

  // Should have 'OUT OF STOCK' message instead of 'ADD TO CART' button
  const addToCartButton = screen.queryByRole('button', { name: 'ADD TO CART' });
  const outOfStockMessage = screen.getByText('OUT OF STOCK');
  expect(addToCartButton).not.toBeInTheDocument();
  expect(outOfStockMessage).toBeInTheDocument();
});
