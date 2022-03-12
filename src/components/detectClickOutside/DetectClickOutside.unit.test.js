import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetectClickOutside } from './DetectClickOutside';

test('should detect click outside of the component', async () => {
  // Declare component props
  const onClickOutside = jest.fn();

  // Render the component
  const user = userEvent.setup();
  render(
    <div>
      <button>outside</button>
      <DetectClickOutside onClickOutside={onClickOutside}>
        <button>inside</button>
      </DetectClickOutside>
    </div>
  );

  // Click once inside and once outside of the DetectClickOutside component
  await user.click(screen.getByRole('button', { name: 'inside' }));
  await user.click(screen.getByRole('button', { name: 'outside' }));

  // onClickOutside function should be called just once
  expect(onClickOutside).toBeCalledTimes(1);
});

test('should accept a class for its container element', () => {
  // Declare component props
  const onClickOutside = jest.fn();
  const className = 'detectClickOutside__container';

  // Render the component
  const user = userEvent.setup();
  render(
    <DetectClickOutside className={className} onClickOutside={onClickOutside}>
      <button>inside</button>
    </DetectClickOutside>
  );

  // Container element of DetectClickOutside should have the given class
  expect(screen.getByTestId('detectClickOutsideContainer')).toHaveClass(
    className
  );
});
