import { render, screen, prettyDOM } from '../../test/utils/utils';
import { Header } from './Header';

jest.mock('../currencySwitcher/CurrencySwitcher', () => {
  return {
    CurrencySwitcher: () => <span>CurrencySwitcher</span>,
  };
});

test('should render categories', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];

  // Render the component
  await render(<Header categories={categories} />);

  // Expect to find categories in the screen
  expect(screen.getByText('all')).toBeInTheDocument();
  expect(screen.getByText('clothes')).toBeInTheDocument();
  expect(screen.getByText('cars')).toBeInTheDocument();
});

test('selected category should get -selected class, to have different UI', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const selectedCategory = 'cars';

  // Render the component
  await render(
    <Header categories={categories} selectedCategory={selectedCategory} />
  );

  // Expect selected category item to have -selected class
  expect(screen.getByRole('link', { name: 'cars' })).toHaveClass('-selected');
});

test('should change url when a category gets selected', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];

  // Render the component
  const { user } = await render(<Header categories={categories} />);

  // Click on a cetegory to select it
  await user.click(screen.getByRole('link', { name: 'cars' }));

  // Expect query string in the URL to have "category=cars"
  expect(window.location.search.includes('category=cars')).toBeTruthy();
});

test('should redirect to /products page when the logo gets clicked', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];

  // Render the component
  const { user } = await render(<Header categories={categories} />);

  // Click on the logo
  await user.click(screen.getByAltText('Logo'));

  // The URL should be '/products'
  expect(window.location.pathname).toBe('/products');
  expect(window.location.search).toBe('');
});

test('should render drawer when width is <= 768', async () => {
  // Declare initial data and render the component
  window.innerWidth = 768;
  const categories = ['all', 'clothes', 'cars'];
  const { user } = await render(<Header categories={categories} />);

  // Drawer's toggler should be in the UI
  const headerDrawerToggler = screen.getByTestId('headerDrawerToggler');
  expect(headerDrawerToggler).toBeInTheDocument();

  // Click on the drawer's toggler to open the drawer
  await user.click(headerDrawerToggler);

  // Drawer's header should be in the UI (it means the drawer is open)
  const drawerHeader = screen.getByTestId('drawerHeader');
  expect(drawerHeader).toBeInTheDocument();
});
