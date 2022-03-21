import { render, screen } from '../../test/utils';
import { Button } from './Button';

test('should render title', () => {
  render(<Button title="My Button" />);

  // Find a button with 'My Button' text
  expect(screen.getByRole('button', { name: 'My Button' })).toBeInTheDocument();
});

test('should render children', () => {
  render(
    <Button>
      <span>My Button</span>
    </Button>
  );

  // Find a button with 'My Button' text
  expect(screen.getByText('My Button')).toBeInTheDocument();
});

test('should fire onClick event handler', async () => {
  const onClick = jest.fn();
  const { user } = render(<Button title="My Button" onClick={onClick} />);

  // Click on the button
  await user.click(screen.getByRole('button'));

  // onClicked should be clicked once
  expect(onClick).toBeCalledTimes(1);
});

test('button should get a class', async () => {
  render(<Button title="My Button" className="my-class" />);

  // The button has 'my-class' class
  expect(screen.getByRole('button')).toHaveClass('my-class');
});

test('default "size" prop should be "big"', () => {
  render(<Button title="My Button" />);

  // Should have '-big' class by default
  expect(screen.getByRole('button')).toHaveClass('-big');
});

test('should be effected by "size" prop', () => {
  render(
    <>
      <Button title="small" size="small" />
      <Button title="big" size="big" />
    </>
  );

  // Buttons get '-small' or '-big' classes by props
  expect(screen.getByRole('button', { name: 'small' })).toHaveClass('-small');
  expect(screen.getByRole('button', { name: 'big' })).toHaveClass('-big');
});

test('default "theme" prop should be "green"', () => {
  render(<Button title="My Button" />);

  // Should have '-green' class by default
  expect(screen.getByRole('button')).toHaveClass('-green');
});

test('should be effected by "theme" prop', () => {
  render(
    <>
      <Button title="green" theme="green" />
      <Button title="dark" theme="dark" />
      <Button title="light" theme="light" />
    </>
  );

  // Buttons get '-green' or '-dark' or '-light' classes by props
  expect(screen.getByRole('button', { name: 'green' })).toHaveClass('-green');
  expect(screen.getByRole('button', { name: 'dark' })).toHaveClass('-dark');
  expect(screen.getByRole('button', { name: 'light' })).toHaveClass('-light');
});

test('should get style by props', () => {
  const style = { borderColor: 'red', height: '10px', width: '10px' };
  render(<Button title="My Button" style={style} />);

  // The button should have defined styles
  expect(screen.getByRole('button')).toHaveStyle(style);
});
