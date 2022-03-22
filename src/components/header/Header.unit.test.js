import { render, screen } from '../../test/utils/utils';
import { Header } from './Header';

jest.mock('../currencySwitcher/CurrencySwitcher', () => {
  return {
    CurrencySwitcher: () => <span>CurrencySwitcher</span>,
  };
});

test('should render categories', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Expect to find categories in the screen
  expect(screen.getByText('all')).toBeInTheDocument();
  expect(screen.getByText('clothes')).toBeInTheDocument();
  expect(screen.getByText('cars')).toBeInTheDocument();
});

test('selected category should get -selected class, to have different UI', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();
  const selectedCategory = 'cars';

  // Render the component
  await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
      selectedCategory={selectedCategory}
    />
  );

  // Expect selected category item to have -selected class
  expect(screen.getByRole('link', { name: 'cars' })).toHaveClass('-selected');
});

test('should change url when a category gets selected', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  const { user } = await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on a cetegory to select it
  await user.click(screen.getByRole('link', { name: 'cars' }));

  // Expect query string in the URL to have "category=cars"
  expect(window.location.search.includes('category=cars')).toBeTruthy();
});

test('should save selected category to the store', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  const { user } = await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on a cetegory to select it
  await user.click(screen.getByRole('link', { name: 'cars' }));

  // Expect the selected category to be saved to the store
  expect(dispatchCategorySelected).toBeCalled();
  expect(dispatchCategorySelected).toBeCalledWith('cars');
});

test('should get selected category from URL', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />,
    { route: '/products?category=cars' }
  );

  // The selected category from URL should be saved to the store
  expect(dispatchCategorySelected).toBeCalled();
  expect(dispatchCategorySelected).toBeCalledWith('cars');
});

test('should redirect to /products page when the logo gets clicked', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  const { user } = await render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on the logo
  await user.click(screen.getByAltText('Logo'));

  // The URL should be '/products'
  expect(window.location.pathname).toBe('/products');
  expect(window.location.search).toBe('');
});
