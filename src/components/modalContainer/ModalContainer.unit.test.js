import { render, screen } from '../../test/utils';
import { ModalContainer } from './ModalContainer';

test('should show the modal', async () => {
  // Prepare initial data and render the component
  const onModalClose = jest.fn();
  const title = 'modal title';
  await render(
    <ModalContainer onModalClose={onModalClose} title={title}>
      <h1>modal content</h1>
    </ModalContainer>
  );

  // modal title should be in the UI
  const titleElement = screen.getByRole('heading', {
    name: /modal title/,
  });
  expect(titleElement).toBeInTheDocument();

  // modal children (content) should be in the UI
  const modalChildrenElement = screen.getByRole('heading', {
    name: /modal content/,
  });
  expect(modalChildrenElement).toBeInTheDocument();
});

test('modal should be closed by clicking on the close button', async () => {
  // Prepare initial data and render the component
  const onModalClose = jest.fn();
  const { user } = await render(
    <ModalContainer onModalClose={onModalClose}>
      <h1>modal content</h1>
    </ModalContainer>
  );

  // Click on the close button
  const closeButtonElement = screen.getByRole('button');
  await user.click(closeButtonElement);

  // Now the modal should be closed
  expect(onModalClose).toBeCalled();
});

test('modal should be closed by pressing Escape button', async () => {
  // Prepare initial data and render the component
  const onModalClose = jest.fn();
  const { user } = await render(
    <ModalContainer onModalClose={onModalClose}>
      <h1>modal content</h1>
    </ModalContainer>
  );

  // Press escape button
  await user.keyboard('{Escape}');

  // Now the modal should be closed
  expect(onModalClose).toBeCalled();
});
