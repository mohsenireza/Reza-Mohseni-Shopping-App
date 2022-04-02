import { render, screen } from '../../test/utils';
import { fakeCartProducts } from '../../mocks';
import { MiniCart } from './MiniCart';

// Mock 'react-router-dom'
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// Mock the CartItem component
jest.mock('../cartItem/CartItem', () => {
  return {
    CartItem: ({ id }) => <h3>{id}</h3>,
  };
});

beforeEach(() => {
  // Clear mock
  mockNavigate.mockClear();
});

test('a badge should show the total cart item quantity', async () => {
  // Prepare initial data and render the component
  const cartProductIds = [fakeCartProducts[0].id, fakeCartProducts[1].id];
  const totalCartItemQuantity = 3;
  const totalPrice = '$100';
  const { user } = await render(
    <MiniCart
      cartProductIds={cartProductIds}
      totalCartItemQuantity={totalCartItemQuantity}
      totalPrice={totalPrice}
    />
  );

  // A badge with totalCartItemQuantity should be in the UI
  const badge = screen.getByText(totalCartItemQuantity);
  expect(badge).toBeInTheDocument();
});

test('open miniCart and show the data', async () => {
  // Prepare initial data and render the component
  const cartProductIds = [fakeCartProducts[0].id, fakeCartProducts[1].id];
  const totalCartItemQuantity = 3;
  const totalPrice = '$100';
  const { user } = await render(
    <MiniCart
      cartProductIds={cartProductIds}
      totalCartItemQuantity={totalCartItemQuantity}
      totalPrice={totalPrice}
    />
  );

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByRole('button');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // totalCartItemQuantity should be in the UI
  const totalCountElement = screen.getByRole('heading', {
    name: /3 items/,
  });
  expect(totalCountElement).toBeInTheDocument();

  // Should render a <CartItem /> for each cartProduct
  // Mocked version of <CartItem /> just renders the id
  cartProductIds.forEach((cartProductId) => {
    const cartProductIdElement = screen.getByRole('heading', {
      name: cartProductId,
    });
    expect(cartProductIdElement).toBeInTheDocument();
  });

  // totalPrice should be in the UI
  const totalPriceElement = screen.getByText(totalPrice);
  expect(totalPriceElement).toBeInTheDocument();
});

test('Clicking on "VIEW BAG" button navigates to /cart page', async () => {
  // Prepare initial data and render the component
  const cartProductIds = [fakeCartProducts[0].id, fakeCartProducts[1].id];
  const totalCartItemQuantity = 3;
  const totalPrice = '$100';
  const router = {
    navigate: () => console.log('testttttttttt'),
  };
  const { user } = await render(
    <MiniCart
      cartProductIds={cartProductIds}
      totalCartItemQuantity={totalCartItemQuantity}
      totalPrice={totalPrice}
      router={router}
    />
  );

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByRole('button');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // Click on the 'VIEW BAG' button
  const viewBagButtonElement = screen.getByRole('button', {
    name: /view bag/i,
  });
  await user.click(viewBagButtonElement);

  // Now we should be in /cart page
  expect(mockNavigate).toBeCalledWith('/cart');
});

test('should close miniCart', async () => {
  // Prepare initial data and render the component
  const cartProductIds = [fakeCartProducts[0].id, fakeCartProducts[1].id];
  const totalCartItemQuantity = 3;
  const totalPrice = '$100';
  const router = {
    navigate: () => console.log('testttttttttt'),
  };
  const { user } = await render(
    <MiniCart
      cartProductIds={cartProductIds}
      totalCartItemQuantity={totalCartItemQuantity}
      totalPrice={totalPrice}
      router={router}
    />
  );

  // Click on the cart icon to open the miniCart
  const cartIconButton = screen.getByRole('button');
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // totalCartItemQuantity should be in the UI
  let totalCountElement = screen.getByRole('heading', {
    name: /3 items/,
  });
  expect(totalCountElement).toBeInTheDocument();

  // Click on the cart icon again to close the miniCart
  await user.pointer({ target: cartIconButton, keys: '[MouseLeft]' });

  // totalCartItemQuantity should not be in the UI
  totalCountElement = screen.queryByRole('heading', {
    name: /3 items/,
  });
  expect(totalCountElement).not.toBeInTheDocument();
});
