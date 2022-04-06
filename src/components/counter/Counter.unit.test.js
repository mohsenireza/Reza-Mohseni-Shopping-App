import { render, screen } from '../../test/utils';
import { Counter } from './Counter';

test('should show the count', async () => {
  // Prepare initial data and render the component
  const count = 2;
  const onCountChange = jest.fn();
  const onRemove = jest.fn();
  await render(
    <Counter count={count} onCountChange={onCountChange} onRemove={onRemove} />
  );

  // Component should show the given count
  expect(screen.getByText(count)).toBeInTheDocument();
});

test('should be able to increase the count', async () => {
  // Prepare initial data and render the component
  const count = 2;
  const onCountChange = jest.fn();
  const onRemove = jest.fn();
  const { user } = await render(
    <Counter count={count} onCountChange={onCountChange} onRemove={onRemove} />
  );

  // Find the increase count button
  const increaseButtonElement = screen.getByRole('button', {
    name: 'Increase Count',
  });

  // Click on the increase count button
  await user.click(increaseButtonElement);

  // 'onCountChange' should be called
  expect(onCountChange).toBeCalledTimes(1);
  expect(onCountChange).toBeCalledWith(count + 1);
});

test('should be able to decrease the count', async () => {
  // Prepare initial data and render the component
  const count = 2;
  const onCountChange = jest.fn();
  const onRemove = jest.fn();
  const { user } = await render(
    <Counter count={count} onCountChange={onCountChange} onRemove={onRemove} />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByRole('button', {
    name: 'Decrease Count',
  });

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'onCountChange' should be called
  expect(onCountChange).toBeCalledTimes(1);
  expect(onCountChange).toBeCalledWith(count - 1);
});

test('should be able to remove the count', async () => {
  // Prepare initial data and render the component
  const count = 1;
  const onCountChange = jest.fn();
  const onRemove = jest.fn();
  const { user } = await render(
    <Counter count={count} onCountChange={onCountChange} onRemove={onRemove} />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'onRemove' should be called
  expect(onRemove).toBeCalledTimes(1);
});
