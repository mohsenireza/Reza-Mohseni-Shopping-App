[Ecommerce Store](https://ecommerce-store-web-app.netlify.app/) is a shopping web app that I developed with React. users can filter products based on categories and choose what currency to be used for prices. meanwhile users can add products to their cart with specific features like size, color, quantity, etc...

In the development process I have made the web app keyboard accessible specially when it comes to modals. due to some tools like Jest, React Testing Library and Cypress, the web app has reasonable code coverage in terms of unit, integration and end to end testing. and after each commit/push I was confident enough about it thanks to CI tools such as CircleCI. for state management even though I have been using MobX-State-Tree for my previous projects, but for this one I have used Redux Toolkit to see how it works in a project like this and to be honest the result was quite pleasing thanks to its clean and expectable structure. Sass has been used for styling and the UI is responsive for mobile users. also the PWA is worth installing as it feels like a native app.

Check out the published [Ecommerce Store](https://ecommerce-store-web-app.netlify.app/) web app from [here](https://ecommerce-store-web-app.netlify.app/).

<br/>

https://user-images.githubusercontent.com/49490512/173395677-8f8537e8-345d-41f1-a4cc-66b80be09634.mov

<br/>

## Available Scripts

### `yarn start`
Runs the app in the development mode.

### `yarn test:unit`
Runs unit tests.

### `yarn test:integration`
Runs integration tests.

### `yarn test:e2e`
Runs end to end tests.
