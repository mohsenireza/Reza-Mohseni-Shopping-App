import { render, screen, within } from '../../test/utils/utils';
import { Attribute } from './Attribute';
import { fakeAttributes } from '../../mocks';
import { rgbTohex } from '../../utils';

const textAttribute = fakeAttributes[0];
const colorAttribute = fakeAttributes[1];

test('should render text attribute items', async () => {
  await render(<Attribute {...textAttribute} />);

  // Attribute items should be rendered
  textAttribute.items.forEach((item) => {
    expect(
      screen.getByRole('button', { name: item.value })
    ).toBeInTheDocument();
  });
});

test('should be able to select a text attribute item', async () => {
  const onAttributeSelect = jest.fn();
  const { user, rerender } = await render(
    <Attribute {...textAttribute} onAttributeSelect={onAttributeSelect} />
  );

  // Pick an attribute item object to select
  const attributeItemToSelect = textAttribute.items[1];

  // Pick element corresponding to the attribute item object
  const attributeItemElement = screen.getByRole('button', {
    name: attributeItemToSelect.value,
  });

  // The attribute item element shouldn't have '-dark' class, which means it's not selected
  expect(attributeItemElement).not.toHaveClass('-dark');

  // Click on the attribute item
  await user.click(attributeItemElement);

  // 'onAttributeSelect' prop should be called
  expect(onAttributeSelect).toBeCalledTimes(1);
  expect(onAttributeSelect).toBeCalledWith({
    attributeId: textAttribute.id,
    attributeSelectedItemId: attributeItemToSelect.id,
  });

  // After selecting an attribute item, the component should rerender with a new 'selectedItemId' prop
  rerender(
    <Attribute
      {...textAttribute}
      onAttributeSelect={onAttributeSelect}
      selectedItemId={attributeItemToSelect.id}
    />
  );

  // The attribute item element should have '-dark' class, which means it's selected
  expect(attributeItemElement).toHaveClass('-dark');
});

test('should render color attribute items', async () => {
  await render(<Attribute {...colorAttribute} />);

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
  const onAttributeSelect = jest.fn();
  const { user, rerender } = await render(
    <Attribute {...colorAttribute} onAttributeSelect={onAttributeSelect} />
  );

  // Pick an attribute item object to select
  const attributeItemToSelect = colorAttribute.items[1];

  // Pick element corresponding to the attribute item object
  const attributeItemElement = screen.getAllByRole('button')[1];

  // The attribute item element shouldn't have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).not.toBeInTheDocument();

  // Click on the attribute item
  await user.click(attributeItemElement);

  // 'onAttributeSelect' prop should be called
  expect(onAttributeSelect).toBeCalledTimes(1);
  expect(onAttributeSelect).toBeCalledWith({
    attributeId: colorAttribute.id,
    attributeSelectedItemId: attributeItemToSelect.id,
  });

  // After selecting an attribute item, the component should rerender with a new 'selectedItemId' prop
  rerender(
    <Attribute
      {...colorAttribute}
      onAttributeSelect={onAttributeSelect}
      selectedItemId={attributeItemToSelect.id}
    />
  );

  // The attribute item element should have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).toBeInTheDocument();
});

test('attribute item should have a tooltip', async () => {
  await render(<Attribute {...colorAttribute} />);

  // Find tooltip elements in the document
  colorAttribute.items.forEach((item) => {
    expect(screen.getByText(item.displayValue)).toBeInTheDocument();
  });
});

test('user cant select text attribute when "isDisabled" prop is true', async () => {
  const onAttributeSelect = jest.fn();
  const { user } = await render(
    <Attribute
      isDisabled={true}
      {...textAttribute}
      onAttributeSelect={onAttributeSelect}
    />
  );

  const attributeItemElement = screen.getByRole('button', {
    name: textAttribute.items[1].value,
  });

  // Click on the attribute item
  await user.click(attributeItemElement);

  // 'onAttributeSelect' prop shouldn't be called
  expect(onAttributeSelect).not.toBeCalled();
});

test('user cant select color attribute when "isDisabled" prop is true', async () => {
  const { user } = await render(
    <Attribute isDisabled={true} {...colorAttribute} />
  );

  const attributeItemElement = screen.getAllByRole('button')[1];

  // Click on the attribute item
  await user.click(attributeItemElement);

  // The attribute item element shouldn't have a visible check mark
  expect(
    attributeItemElement.querySelector('.attribute__itemCheckMark.-show')
  ).not.toBeInTheDocument();
});
