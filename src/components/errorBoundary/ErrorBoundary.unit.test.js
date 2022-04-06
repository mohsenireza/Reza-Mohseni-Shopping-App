import { render, screen } from '../../test/utils';
import { ErrorBoundary } from './ErrorBoundary';

test('should render children if there is not any error', async () => {
  // Prepare initial data and render the component
  await render(
    <ErrorBoundary>
      <h1>content</h1>
    </ErrorBoundary>
  );

  // the children should be in the UI
  const childrenElement = screen.getByRole('heading', { name: /content/i });
  expect(childrenElement).toBeInTheDocument();
});

test('should show an error message if there is an error', async () => {
  // Prepare initial data and render the component
  const ThrowError = () => {
    throw new Error('Test');
  };
  await render(
    <ErrorBoundary>
      <h1>content</h1>
      <ThrowError />
    </ErrorBoundary>
  );

  // the children should not be in the UI
  const childrenElement = screen.queryByRole('heading', { name: /content/i });
  expect(childrenElement).not.toBeInTheDocument();

  // Error message should be in the UI
  const errorElement = screen.getByRole('heading', {
    name: /please try again later/i,
  });
  expect(errorElement).toBeInTheDocument();
});
