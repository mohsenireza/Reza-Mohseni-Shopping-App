import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencySwitcher } from './CurrencySwitcher';

test('currency list should not be open by default', () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Expect currency list not to be in the document
  expect(screen.queryByText('$ USD')).not.toBeInTheDocument();
  expect(screen.queryByText('A$ AUD')).not.toBeInTheDocument();
  expect(screen.queryByText('£ GBP')).not.toBeInTheDocument();
});

test('should open currency list by user click', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Click to open the currency list
  await user.click(screen.getByRole('button'));

  // Expect to find currency
  expect(screen.getByText('$ USD')).toBeInTheDocument();
  expect(screen.getByText('A$ AUD')).toBeInTheDocument();
  expect(screen.getByText('£ GBP')).toBeInTheDocument();
});

test('should close currency list after user selected a currency', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Click to open the currency list
  await user.click(screen.getByRole('button'));
  // Click to select a currency
  await user.click(screen.getByText('$ USD'));

  // Expect currency list to be closed
  expect(screen.queryByText('$ USD')).not.toBeInTheDocument();
  expect(screen.queryByText('A$ AUD')).not.toBeInTheDocument();
  expect(screen.queryByText('£ GBP')).not.toBeInTheDocument();
});

test('should close currency list by clicking outside of the component', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <>
      <span>outside of component</span>
      <CurrencySwitcher
        currencies={currencies}
        dispatchCurrencySelected={dispatchCurrencySelected}
      />
    </>
  );

  // Click on the CurrencySwitcher to open the currency list
  await user.click(screen.getByRole('button'));

  // Make sure currency list is open
  expect(screen.getByText('$ USD')).toBeInTheDocument();
  expect(screen.getByText('A$ AUD')).toBeInTheDocument();
  expect(screen.getByText('£ GBP')).toBeInTheDocument();

  // Click outside of the CurrencySwitcher component
  await user.click(screen.getByText('outside of component'));

  // Make sure currency list is closed
  expect(screen.queryByText('$ USD')).not.toBeInTheDocument();
  expect(screen.queryByText('A$ AUD')).not.toBeInTheDocument();
  expect(screen.queryByText('£ GBP')).not.toBeInTheDocument();
});

test('should close the curreny list by clicking on the component header', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <>
      <span>outside of component</span>
      <CurrencySwitcher
        currencies={currencies}
        dispatchCurrencySelected={dispatchCurrencySelected}
      />
    </>
  );

  // Click on the CurrencySwitcher to open the currency list
  await user.click(screen.getByRole('button'));

  // Make sure currency list is open
  expect(screen.getByText('$ USD')).toBeInTheDocument();
  expect(screen.getByText('A$ AUD')).toBeInTheDocument();
  expect(screen.getByText('£ GBP')).toBeInTheDocument();

  // Click on the component header
  await user.click(screen.getByTestId('currencySwitcherHeader'));

  // Make sure currency list is closed
  expect(screen.queryByText('$ USD')).not.toBeInTheDocument();
  expect(screen.queryByText('A$ AUD')).not.toBeInTheDocument();
  expect(screen.queryByText('£ GBP')).not.toBeInTheDocument();
});

test('should save selected currency in store', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Click to open the currency list
  await user.click(screen.getByRole('button'));
  // Click to select a currency
  await user.click(screen.getByText('$ USD'));

  // Selected currency should be saved in store
  expect(dispatchCurrencySelected).toBeCalled();
  expect(dispatchCurrencySelected).toBeCalledWith({
    label: 'USD',
    symbol: '$',
  });
});

test('should save selected currency in localStorage', async () => {
  // Setup spy on localStorage.setItem
  const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');

  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Click to open the currency list
  await user.click(screen.getByRole('button'));
  // Click to select a currency
  await user.click(screen.getByText('$ USD'));

  // Should save the selected currency to localStorage
  expect(localStorageSetItemSpy).toBeCalledTimes(1);
  expect(localStorageSetItemSpy).toBeCalledWith(
    'currency',
    JSON.stringify({ label: 'USD', symbol: '$' })
  );

  // Restore localStorage spy
  localStorageSetItemSpy.mockRestore();
});

test('should show symbol of selected currency', async () => {
  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const selectedCurrency = { label: 'USD', symbol: '$' };
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
      selectedCurrency={selectedCurrency}
    />
  );

  // Expect to find the symbol of selected currency which is $
  expect(screen.getByText(selectedCurrency.symbol)).toBeInTheDocument();
});

test('should load selected currency from localStorage', () => {
  // Setup localStorage.getItem spy
  const localStorageGetItemSpy = jest
    .spyOn(localStorage.__proto__, 'getItem')
    .mockImplementation(() => '{"label":"USD","symbol":"$"}');

  // Declare component props
  const currencies = [
    { label: 'USD', symbol: '$' },
    { label: 'AUD', symbol: 'A$' },
    { label: 'GBP', symbol: '£' },
  ];
  const dispatchCurrencySelected = jest.fn();

  // Render component
  const user = userEvent.setup();
  render(
    <CurrencySwitcher
      currencies={currencies}
      dispatchCurrencySelected={dispatchCurrencySelected}
    />
  );

  // Expect the default selected currency to be saved in the store
  expect(dispatchCurrencySelected).toBeCalledTimes(1);
  expect(dispatchCurrencySelected).toBeCalledWith({
    label: 'USD',
    symbol: '$',
  });

  // Restore localStorage spy
  localStorageGetItemSpy.mockRestore();
});
