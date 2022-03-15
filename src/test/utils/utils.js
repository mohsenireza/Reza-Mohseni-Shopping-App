import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../config/store';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AllTheProviders, ...options }),
});

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
