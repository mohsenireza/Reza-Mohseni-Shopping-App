import { render, screen } from '../../test/utils/utils';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';

// Declare global data
const fakeProduct = {
  id: '1',
  name: 'Nike Air Huarache Le',
  inStock: true,
  gallery: [
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_2_720x.jpg?v=1612816087',
  ],
  prices: [
    {
      currency: {
        label: 'USD',
        symbol: '$',
      },
      amount: 144,
    },
    {
      currency: {
        label: 'GBP',
        symbol: '£',
      },
      amount: 104,
    },
  ],
};
const selectedCurrency = {
  label: 'USD',
  symbol: '$',
};
const selectProductById = () => fakeProduct;

test('should render product data', () => {
  // Render the component
  render(
    <ProductCard
      productId={fakeProduct.id}
      selectProductById={selectProductById}
      selectedCurrency={selectedCurrency}
    />
  );

  // UI should render based on the product data
  expect(screen.getByAltText(fakeProduct.name)).toBeInTheDocument();
  expect(screen.getByAltText(fakeProduct.name).src).toBe(
    fakeProduct.gallery[0]
  );
  expect(screen.getByText(fakeProduct.name)).toBeInTheDocument();
  expect(screen.getByText('$144')).toBeInTheDocument();
});

test('should redirect to product page by clicking on the product image', async () => {
  // Render the component
  const user = userEvent.setup();
  render(
    <ProductCard
      productId={fakeProduct.id}
      selectProductById={selectProductById}
      selectedCurrency={selectedCurrency}
    />
  );

  // Click on product image
  await user.click(screen.getByAltText(fakeProduct.name));

  // Check the URL
  expect(window.location.pathname).toBe(`/product/${fakeProduct.id}`);
});

test('should redirect to product page by clicking on the product name', async () => {
  // Render the component
  const user = userEvent.setup();
  render(
    <ProductCard
      productId={fakeProduct.id}
      selectProductById={selectProductById}
      selectedCurrency={selectedCurrency}
    />
  );

  // Click on product name
  await user.click(screen.getByText(fakeProduct.name));

  // Check the URL
  expect(window.location.pathname).toBe(`/product/${fakeProduct.id}`);
});

test('should show price based on the selected currency', () => {
  // Render the component
  const { rerender } = render(
    <ProductCard
      productId={fakeProduct.id}
      selectProductById={selectProductById}
      selectedCurrency={selectedCurrency}
    />
  );

  // Price is shown based on the selected currency
  expect(screen.getByText('$144')).toBeInTheDocument();

  // Rerender the component with a new selected currency
  const newSelectedCurrency = {
    label: 'GBP',
    symbol: '£',
  };
  rerender(
    <ProductCard
      productId={fakeProduct.id}
      selectProductById={selectProductById}
      selectedCurrency={newSelectedCurrency}
    />
  );

  // Price is shown based on the new selected currency
  expect(screen.getByText('£104')).toBeInTheDocument();
});

test('should show out of stock message', () => {
  // Render the component with an out of stock product
  const outOfStockProduct = { ...fakeProduct, inStock: false };
  render(
    <ProductCard
      productId={outOfStockProduct.id}
      selectProductById={() => outOfStockProduct}
      selectedCurrency={selectedCurrency}
    />
  );

  // Check the out of stock message is available
  expect(screen.getByText('OUT OF STOCK')).toBeInTheDocument();
});

test('should not render add to cart button for an out of stock product', () => {
  // Render the component with an out of stock product
  const outOfStockProduct = { ...fakeProduct, inStock: false };
  render(
    <ProductCard
      productId={outOfStockProduct.id}
      selectProductById={() => outOfStockProduct}
      selectedCurrency={selectedCurrency}
    />
  );

  // Check the add to cart button is not rendered
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
