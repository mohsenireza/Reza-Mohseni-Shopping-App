import { fakeShoesProduct, fakeIphone12Product } from './index';

const { id: fakeShoesProductId, ...fakeShoesProductOtherProps } =
  fakeShoesProduct;
const { id: fakeIphone12ProductId, ...fakeIphone12ProductOtherProps } =
  fakeIphone12Product;

const fakeStorageOrderList = [
  {
    id: '1',
    productId: fakeShoesProductId,
    quantity: 1,
    selectedAttributes: [{ id: 'Size', selectedItemId: '40' }],
    addedTimestamp: 1649415051362,
  },
  {
    id: '2',
    productId: fakeIphone12ProductId,
    quantity: 2,
    selectedAttributes: [
      { id: 'Capacity', selectedItemId: '512G' },
      { id: 'Color', selectedItemId: 'Cyan' },
    ],
    addedTimestamp: 1649415077581,
  },
];

const fakeOrderList = [
  { ...fakeStorageOrderList[0], ...fakeShoesProductOtherProps },
  { ...fakeStorageOrderList[1], ...fakeIphone12ProductOtherProps },
];

export { fakeStorageOrderList, fakeOrderList };
