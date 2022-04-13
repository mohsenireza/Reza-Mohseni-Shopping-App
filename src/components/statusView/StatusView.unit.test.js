import { render, screen } from '../../test/utils';
import { StatusView } from './StatusView';

test('should show loading', async () => {
  // Prepare initial data and render the component
  await render(<StatusView type="loading" />, {
    shouldWaitForLoadingToFinish: false,
  });

  // Loading spinner should be in the UI
  const loadingSpinnerElement = screen.getByRole('img', {
    name: /loading spinner/i,
  });
  expect(loadingSpinnerElement).toBeInTheDocument();
});

test('should show error', async () => {
  // Prepare initial data and render the component
  await render(<StatusView type="error" />);

  // Error message should be in the UI
  const errorElement = screen.getByRole('heading', {
    name: /please try again later/i,
  });
  expect(errorElement).toBeInTheDocument();
});

test('nothing should be rendered if type is invalid', async () => {
  // Prepare initial data and render the component
  await render(<StatusView type="invalidType" />);

  // Loading spinner should not be in the UI
  const loadingSpinnerElement = screen.queryByRole('img', {
    name: /loading spinner/i,
  });
  expect(loadingSpinnerElement).not.toBeInTheDocument();

  // Error message should not be in the UI
  const errorElement = screen.queryByRole('heading', {
    name: /please try again later/i,
  });
  expect(errorElement).not.toBeInTheDocument();
});
