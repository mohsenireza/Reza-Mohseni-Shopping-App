import { render, screen } from '../../test/utils';
import { PageWrapper } from './PageWrapper';

test('should show the loading spinner', async () => {
  // Prepare initial data and render the component
  await render(
    <PageWrapper loading={true}>
      <h1>content</h1>
    </PageWrapper>,
    { shouldWaitForLoadingToFinish: false }
  );

  // The loading spinner should be in the UI
  const loadingElement = screen.getByRole('img', { name: /Loading Spinner/ });
  expect(loadingElement).toBeInTheDocument();

  // The error should not be in the UI
  const errorElement = screen.queryByRole('heading', {
    name: /Please Try Again Later/,
  });
  expect(errorElement).not.toBeInTheDocument();

  // The children should not be in the UI
  const childrenElement = screen.queryByRole('heading', { name: /content/ });
  expect(childrenElement).not.toBeInTheDocument();
});

test('should show the error', async () => {
  // Prepare initial data and render the component
  await render(
    <PageWrapper error={true}>
      <h1>content</h1>
    </PageWrapper>
  );

  // The loading spinner should not be in the UI
  const loadingElement = screen.queryByRole('img', { name: /Loading Spinner/ });
  expect(loadingElement).not.toBeInTheDocument();

  // The error should be in the UI
  const errorElement = screen.getByRole('heading', {
    name: /Please Try Again Later/,
  });
  expect(errorElement).toBeInTheDocument();

  // The children should not be in the UI
  const childrenElement = screen.queryByRole('heading', { name: /content/ });
  expect(childrenElement).not.toBeInTheDocument();
});

test('should show the children', async () => {
  // Prepare initial data and render the component
  await render(
    <PageWrapper>
      <h1>content</h1>
    </PageWrapper>
  );

  // The loading spinner should not be in the UI
  const loadingElement = screen.queryByRole('img', { name: /Loading Spinner/ });
  expect(loadingElement).not.toBeInTheDocument();

  // The error should not be in the UI
  const errorElement = screen.queryByRole('heading', {
    name: /Please Try Again Later/,
  });
  expect(errorElement).not.toBeInTheDocument();

  // The children should be in the UI
  const childrenElement = screen.getByRole('heading', { name: /content/ });
  expect(childrenElement).toBeInTheDocument();
});
