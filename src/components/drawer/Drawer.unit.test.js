import { render, screen, waitFor } from '../../test/utils';
import { Drawer } from './Drawer';

test('toggler will open the drawer', async () => {
  // Prepare initial data and render the component
  const renderToggler = (toggleDrawer) => (
    <button onClick={toggleDrawer}>open</button>
  );
  const renderDrawerBody = () => <h1>drawer body</h1>;
  const { user } = await render(
    <Drawer renderToggler={renderToggler} renderDrawerBody={renderDrawerBody} />
  );

  // Click on the toggler to open the drawer
  const togglerElement = screen.getByRole('button', { name: 'open' });
  await user.click(togglerElement);

  // Drawer should be open and its body should be shown
  const drawerBody = screen.getByRole('heading', {
    name: 'drawer body',
  });
  expect(drawerBody).toBeInTheDocument();
});

test('clicking on the close button will close the drawer', async () => {
  // Prepare initial data and render the component
  const renderToggler = (toggleDrawer) => (
    <button onClick={toggleDrawer}>open</button>
  );
  const renderDrawerBody = () => <h1>drawer body</h1>;
  const { user } = await render(
    <Drawer renderToggler={renderToggler} renderDrawerBody={renderDrawerBody} />
  );

  // Click on the toggler to open the drawer
  const togglerElement = screen.getByRole('button', { name: 'open' });
  await user.click(togglerElement);

  // Drawer should be open and its body should be shown
  let drawerBody = screen.getByRole('heading', { name: 'drawer body' });
  expect(drawerBody).toBeInTheDocument();

  // Click on the close button to close the drawer
  const closeButtonElement = screen.getByTestId('drawerHeaderCloseButton');
  await user.click(closeButtonElement);

  // The drawer should be closed and its body should not be visible anymore
  drawerBody = screen.queryByRole('heading', { name: 'drawer body' });
  expect(drawerBody).not.toBeInTheDocument();
});

test('clicking on the logo will close the drawer', async () => {
  // Prepare initial data and render the component
  const renderToggler = (toggleDrawer) => (
    <button onClick={toggleDrawer}>open</button>
  );
  const renderDrawerBody = () => <h1>drawer body</h1>;
  const { user } = await render(
    <Drawer renderToggler={renderToggler} renderDrawerBody={renderDrawerBody} />
  );

  // Click on the toggler to open the drawer
  const togglerElement = screen.getByRole('button', { name: 'open' });
  await user.click(togglerElement);

  // Drawer should be open and its body should be shown
  let drawerBody = screen.getByRole('heading', { name: 'drawer body' });
  expect(drawerBody).toBeInTheDocument();

  // Click on the logo to close the drawer
  const logoElement = screen.getByRole('link', { name: 'Logo' });
  await user.click(logoElement);

  // The URL should change
  expect(window.location.pathname).toBe('/products');

  // The drawer should be closed and its body should not be visible anymore
  drawerBody = screen.queryByRole('heading', { name: 'drawer body' });
  expect(drawerBody).not.toBeInTheDocument();
});

test('clicking outside of the drawer will close it', async () => {
  // Prepare initial data and render the component
  const renderToggler = (toggleDrawer) => (
    <button onClick={toggleDrawer}>open</button>
  );
  const renderDrawerBody = () => <h1>drawer body</h1>;
  const { user } = await render(
    <>
      <h1>outside</h1>
      <Drawer
        renderToggler={renderToggler}
        renderDrawerBody={renderDrawerBody}
      />
    </>
  );

  // Click on the toggler to open the drawer
  const togglerElement = screen.getByRole('button', { name: 'open' });
  await user.click(togglerElement);

  // Drawer should be open and its body should be shown
  let drawerBody = screen.getByRole('heading', { name: 'drawer body' });
  expect(drawerBody).toBeInTheDocument();

  // Click on the outside of drawer to close it
  const outsideElement = screen.getByRole('heading', { name: 'outside' });
  await user.click(outsideElement);

  // The drawer should be closed and its body should not be visible anymore
  drawerBody = screen.queryByRole('heading', { name: 'drawer body' });
  expect(drawerBody).not.toBeInTheDocument();
});

test('pressing Escape button will close the drawer', async () => {
  // Prepare initial data and render the component
  const renderToggler = (toggleDrawer) => (
    <button onClick={toggleDrawer}>open</button>
  );
  const renderDrawerBody = () => <h1>drawer body</h1>;
  const { user } = await render(
    <>
      <h1>outside</h1>
      <Drawer
        renderToggler={renderToggler}
        renderDrawerBody={renderDrawerBody}
      />
    </>
  );

  // Click on the toggler to open the drawer
  const togglerElement = screen.getByRole('button', { name: 'open' });
  await user.click(togglerElement);

  // Drawer should be open and its body should be shown
  let drawerBody = screen.getByRole('heading', { name: 'drawer body' });
  expect(drawerBody).toBeInTheDocument();

  // Press escape button
  await user.keyboard('{Escape}');

  // The drawer should be closed and its body should not be visible anymore
  drawerBody = screen.queryByRole('heading', { name: 'drawer body' });
  expect(drawerBody).not.toBeInTheDocument();
});
