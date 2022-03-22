import { render, screen, within, waitForLoadingToFinish } from '../utils';
import { setupServer } from 'msw/node';
import { handlers, fakeCurrencies, fakeTechProducts } from '../../mocks';
import { client } from '../../config';
import App from '../../App';

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
  screen.getByText(fakeTechProducts[0].name);
  screen.getByText(fakeTechProducts[1].name);
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
