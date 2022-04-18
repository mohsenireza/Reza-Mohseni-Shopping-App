import { render, screen } from '../../test/utils';
import { fakeOrderList, fakeCurrencies, fakeAttributes } from '../../mocks';
import { CartItem } from './CartItem';

test('should render data', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={() => {}}
      dispatchOrderItemQuantityEdited={() => {}}
    />
  );

  // Brand should be in the UI
  const brandElement = screen.getByRole('link', { name: orderItem.brand });
  expect(brandElement).toBeInTheDocument();

  // Name should be in the UI
  const nameElement = screen.getByRole('link', { name: orderItem.name });
  expect(nameElement).toBeInTheDocument();

  // Price based on the selected category should be in the UI
  const priceBasedOnSelectedCurrency = orderItem.prices.find(
    (price) => price.currency.label === selectedCurrency.label
  ).amount;
  const priceElement = screen.getByText(
    `${selectedCurrency.symbol}${priceBasedOnSelectedCurrency}`
  );
  expect(priceElement).toBeInTheDocument();

  // All attribute items should be in the UI
  orderItem.attributes.forEach((attribute) => {
    attribute.items.forEach((attributeItem) => {
      const attributeItemElement = screen.getByRole('button', {
        name: attributeItem.value,
      });
      expect(attributeItemElement).toBeInTheDocument();
    });
  });

  // Count should be in the UI
  const countElement = screen.getByTestId('counterCount');
  expect(countElement).toHaveTextContent(orderItem.quantity);

  // An image of product should be in the UI
  const productImageElement = screen.getByRole('img', {
    name: `${orderItem.brand} - ${orderItem.name}`,
  });
  expect(productImageElement).toBeInTheDocument();
});

test('selected attribute items are dark when size prop is big', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={() => {}}
      dispatchOrderItemQuantityEdited={() => {}}
    />
  );

  // Selected attribute items should be dark
  orderItem.selectedAttributes.forEach((selectedAttribute) => {
    const attribute = fakeAttributes.find(
      (attribute) => attribute.id === selectedAttribute.id
    );
    const selectedAttributeItemId = selectedAttribute.selectedItemId;
    const selectedAttributeItem = attribute.items.find(
      (attributeItem) => attributeItem.id === selectedAttributeItemId
    );
    const selectedAttributeItemElement = screen.getByRole('button', {
      name: selectedAttributeItem.value,
    });
    expect(selectedAttributeItemElement).toHaveClass('-dark');
  });
});

test('selected attribute items are light when size prop is small', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="small"
      dispatchOrderItemRemoved={() => {}}
      dispatchOrderItemQuantityEdited={() => {}}
    />
  );

  // Selected attribute items should be light
  orderItem.selectedAttributes.forEach((selectedAttribute) => {
    const attribute = fakeAttributes.find(
      (attribute) => attribute.id === selectedAttribute.id
    );
    const selectedAttributeItemId = selectedAttribute.selectedItemId;
    const selectedAttributeItem = attribute.items.find(
      (attributeItem) => attributeItem.id === selectedAttributeItemId
    );
    const selectedAttributeItemElement = screen.getByRole('button', {
      name: selectedAttributeItem.value,
    });
    expect(selectedAttributeItemElement).toHaveClass('-light');
  });
});

test('should be able to remove the product', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchOrderItemRemoved = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const { user } = await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
    />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByTestId('counterDecreaseButton');

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'dispatchOrderItemRemoved' should be called
  expect(dispatchOrderItemRemoved).toBeCalledTimes(1);
});

test('should be able to increase the product count', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchOrderItemRemoved = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const { user } = await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
    />
  );

  // Find the increase count button
  const increaseButtonElement = screen.getByRole('button', {
    name: 'Increase Count',
  });

  // Click on the increase count button
  await user.click(increaseButtonElement);

  // 'dispatchOrderItemQuantityEdited' should be called
  expect(dispatchOrderItemQuantityEdited).toBeCalledTimes(1);
});

test('should be able to decrease the product count', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[1];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchOrderItemRemoved = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const { user } = await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
    />
  );

  // Find the decrease count button
  const decreaseButtonElement = screen.getByRole('button', {
    name: 'Decrease Count',
  });

  // Click on the decrease count button
  await user.click(decreaseButtonElement);

  // 'dispatchOrderItemQuantityEdited' should be called
  expect(dispatchOrderItemQuantityEdited).toBeCalledTimes(1);
});

test('show next and prev product image', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchOrderItemRemoved = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const { user } = await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
    />
  );

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 2 image of product should be visible
  let imageElement = screen.getByRole('img', {
    name: `${orderItem.brand} - ${orderItem.name}`,
  });
  expect(imageElement.src).toBe(orderItem.gallery[1]);

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the 1 image of product should be visible
  imageElement = screen.getByRole('img', {
    name: `${orderItem.brand} - ${orderItem.name}`,
  });
  expect(imageElement.src).toBe(orderItem.gallery[0]);
});

test('loop through images when reaches to the first or last image', async () => {
  // Prepare initial data and render the component
  const orderItem = fakeOrderList[0];
  const selectedCurrency = fakeCurrencies[0];
  const dispatchOrderItemRemoved = jest.fn();
  const dispatchOrderItemQuantityEdited = jest.fn();
  const { user } = await render(
    <CartItem
      id={orderItem.id}
      selectOrderItemById={() => orderItem}
      selectedCurrency={selectedCurrency}
      size="big"
      dispatchOrderItemRemoved={dispatchOrderItemRemoved}
      dispatchOrderItemQuantityEdited={dispatchOrderItemQuantityEdited}
    />
  );

  // Click on the prev image button
  const prevImageButtonElement = screen.getByRole('img', {
    name: 'Prev Image',
  });
  await user.click(prevImageButtonElement);

  // the last image of product should be visible
  let imageElement = screen.getByRole('img', {
    name: `${orderItem.brand} - ${orderItem.name}`,
  });
  expect(imageElement.src).toBe(
    orderItem.gallery[orderItem.gallery.length - 1]
  );

  // Click on the next image button
  const nextImageButtonElement = screen.getByRole('img', {
    name: 'Next Image',
  });
  await user.click(nextImageButtonElement);

  // the 1 image of product should be visible
  imageElement = screen.getByRole('img', {
    name: `${orderItem.brand} - ${orderItem.name}`,
  });
  expect(imageElement.src).toBe(orderItem.gallery[0]);
});
