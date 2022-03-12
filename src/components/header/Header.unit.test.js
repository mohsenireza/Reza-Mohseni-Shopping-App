import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { history } from '../../config';
import { Header } from './Header';

jest.mock('../currencySwitcher/CurrencySwitcher', () => {
  return {
    CurrencySwitcher: () => <span>CurrencySwitcher</span>,
  };
});

test('should render categories', () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  render(
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

test('selected category should get -selected class, to have different UI', () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();
  const selectedCategory = 'cars';

  // Render the component
  render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
      selectedCategory={selectedCategory}
    />
  );

  // Expect selected category item to have -selected class
  expect(screen.getByRole('button', { name: 'cars' })).toHaveClass('-selected');
});

test('should change url when a category gets selected', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  const user = userEvent.setup();
  render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on a cetegory to select it
  await user.click(screen.getByRole('button', { name: 'cars' }));

  // Expect query string in the URL to have "category=cars"
  expect(history.location.search.includes('category=cars')).toBeTruthy();
});

test('should save selected category to store', async () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Render the component
  const user = userEvent.setup();
  render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on a cetegory to select it
  await user.click(screen.getByRole('button', { name: 'cars' }));

  // Expect the selected category to be saved to the store
  expect(dispatchCategorySelected).toBeCalled();
  expect(dispatchCategorySelected).toBeCalledWith('cars');
});

test('should get selected category from URL', () => {
  // Declare component props
  const categories = ['all', 'clothes', 'cars'];
  const dispatchCategorySelected = jest.fn();

  // Put the selected category inside URL as query string
  history.push('/products?category=cars');

  // Render the component
  render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
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
  const user = userEvent.setup();
  render(
    <Header
      categories={categories}
      dispatchCategorySelected={dispatchCategorySelected}
    />
  );

  // Click on the logo
  await user.click(screen.getByAltText('Logo'));

  // The URL should be '/products'
  expect(history.location.pathname).toBe('/products');
  expect(history.location.search).toBe('');
});
