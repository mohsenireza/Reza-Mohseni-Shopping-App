import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStoreOptions } from '../../config/store';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={configureStore(configureStoreOptions)}>
        {children}
      </Provider>
    </BrowserRouter>
  );
};

const customRender = async (ui, { route = '/', ...renderOptions } = {}) => {
  // Handle default route
  window.history.replaceState({}, '', route);

  const returnValue = {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
  };

  // Wait for initial data to be fetched before allowing the test to continue
  await waitForLoadingToFinish();

  return returnValue;
};

const waitForLoadingToFinish = async () => {
  await waitFor(
    () => {
      // Make sure there is not any loading spinner on the screen
      expect(screen.queryAllByAltText('loading-spinner')).toHaveLength(0);
    },
    { timeout: 4000 }
  );
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, waitForLoadingToFinish };
