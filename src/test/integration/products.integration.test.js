import { render, screen, within } from '../utils';
import { setupServer } from 'msw/node';
import { handlers, fakeCurrencies, fakeTechProducts } from '../../mocks';
import App from '../../App';

// Unmock 'react-redux' to ignore the manual mock
jest.unmock('react-redux');

// Config msw to mock APIs
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should fetch categories and show them in the UI', async () => {
  render(<App />);

  // Fetched categories should be in the UI
  const firstCategory = await screen.findByRole('link', { name: 'all' });
  const secondCategory = await screen.findByRole('link', { name: 'clothes' });
  const thirdCategory = await screen.findByRole('link', { name: 'tech' });
  expect(firstCategory).toBeInTheDocument();
  expect(secondCategory).toBeInTheDocument();
  expect(thirdCategory).toBeInTheDocument();
});

test('should fetch currencies and show them in the UI', async () => {
  const { user } = render(<App />);

  // Click on the currency selector menu to open it
  await user.click(await screen.findByTestId('currencySwitcherHeader'));

  // Fetched currencies should be in the UI
  const firstCurrency = screen.getByRole('button', { name: '$ USD' });
  const secondCurrency = screen.getByRole('button', { name: '£ GBP' });
  const thirdCurrency = screen.getByRole('button', { name: 'A$ AUD' });
  expect(firstCurrency).toBeInTheDocument();
  expect(secondCurrency).toBeInTheDocument();
  expect(thirdCurrency).toBeInTheDocument();
});

test('some products should be fetched and rendered when app loads', async () => {
  render(<App />);

  // Find product cards in the UI
  const productCards = await screen.findAllByRole('article');
  productCards.forEach((productCard) =>
    expect(productCard).toBeInTheDocument()
  );
});

test('should fetch products when category changes', async () => {
  const { user } = render(<App />);

  // Click on a category
  const categoryElement = await screen.findByRole('link', {
    name: 'tech',
  });
  await user.click(categoryElement);

  // New products based on the selected category should be rendered
  await screen.findByText(fakeTechProducts[0].name);
  await screen.findByText(fakeTechProducts[1].name);
});

test('should show price of product cards based on the selected currency', async () => {
  const { user } = render(<App />);

  const currencyToSelect = fakeCurrencies[1];
  // Click on the currency selector menu to open it
  await user.click(await screen.findByTestId('currencySwitcherHeader'));
  // Select a currency
  const currencyElement = await screen.findByRole('button', {
    name: `${currencyToSelect.symbol} ${currencyToSelect.label}`,
  });
  await user.click(currencyElement);

  // Each product card should show the price based on the selected currency
  const productCards = await screen.findAllByRole('article');
  productCards.forEach((productCard) => {
    const pattern = new RegExp(currencyToSelect.symbol);
    within(productCard).getByText(pattern);
  });
});
