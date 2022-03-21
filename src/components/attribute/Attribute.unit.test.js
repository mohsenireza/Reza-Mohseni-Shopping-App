import { render, screen, within } from '../../test/utils/utils';
import { Attribute } from './Attribute';
import { fakeAttributes } from '../../mocks';
import { rgbTohex } from '../../utils';

const textAttribute = fakeAttributes[0];
const colorAttribute = fakeAttributes[1];

test('should render text attribute items', () => {
  render(<Attribute {...textAttribute} />);

  // Attribute items should be rendered
  textAttribute.items.forEach((item) => {
    expect(
      screen.getByRole('button', { name: item.value })
    ).toBeInTheDocument();
  });
});

test('should be able to select a text attribute item', async () => {
  const { user } = render(<Attribute {...textAttribute} />);

  const attributeItemElement = screen.getAllByRole('button')[1];

  // The attribute item element shouldn't have '-dark' class, which means it's not selected
  expect(attributeItemElement).not.toHaveClass('-dark');

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item element should have '-dark' class, which means it's selected
  expect(attributeItemElement).toHaveClass('-dark');
});

test('should render color attribute items', () => {
  render(<Attribute {...colorAttribute} />);

  // Attribute items should be rendered
  const attributeItemElements = screen.getAllByRole('button');
  colorAttribute.items.forEach((item) => {
    const isAttributeItemRendered = attributeItemElements.some(
      (attributeItemElement) =>
        rgbTohex(attributeItemElement.style.background).toLowerCase() ===
        item.value.toLowerCase()
    );
    expect(isAttributeItemRendered).toBeTruthy();
  });
});

test('should be able to select a color attribute item', async () => {
  const { user } = render(<Attribute {...colorAttribute} />);

  const attributeItemElement = screen.getAllByRole('button')[1];

  // The attribute item element shouldn't have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).not.toBeInTheDocument();

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item element should have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).toBeInTheDocument();
});

test('attribute item should have a tooltip', () => {
  render(<Attribute {...colorAttribute} />);

  // Find tooltip elements in the document
  colorAttribute.items.forEach((item) => {
    expect(screen.getByText(item.displayValue)).toBeInTheDocument();
  });
});

test('user cant select text attribute when "isDisabled" prop is true', async () => {
  const { user } = render(<Attribute isDisabled={true} {...textAttribute} />);

  const attributeItemElement = screen.getByRole('button', {
    name: textAttribute.items[1].value,
  });

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item is not selected after getting clicked
  expect(attributeItemElement).not.toHaveClass('-dark');
});

test('user cant select color attribute when "isDisabled" prop is true', async () => {
  const { user } = render(<Attribute isDisabled={true} {...colorAttribute} />);

  const attributeItemElement = screen.getAllByRole('button')[1];

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item element shouldn't have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).not.toBeInTheDocument();
});
