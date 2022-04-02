import { fakeShoesProduct, fakeIphone12Product } from './index';

const fakeCartProducts = [
  {
    ...fakeShoesProduct,
    count: 1,
    selectedAttributes: {
      Size: '40',
    },
  },
  {
    ...fakeIphone12Product,
    count: 2,
    selectedAttributes: {
      Capacity: '512G',
      Color: 'Cyan',
    },
  },
];

export { fakeCartProducts };
