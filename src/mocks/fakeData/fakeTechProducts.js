export const fakeTechProducts = [
  {
    id: 'ps-5',
    name: 'PlayStation 5',
    inStock: false,
    gallery: [
      'https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/610%2B69ZsKCL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/51iPoFwQT3L._SL1230_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/61qbqFcvoNL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/51HCjA3rqYL._SL1230_.jpg',
    ],
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        type: 'swatch',
        items: [
          {
            id: 'Green',
            displayValue: 'Green',
            value: '#44FF03',
            __typename: 'Attribute',
          },
          {
            id: 'Cyan',
            displayValue: 'Cyan',
            value: '#03FFF7',
            __typename: 'Attribute',
          },
          {
            id: 'Blue',
            displayValue: 'Blue',
            value: '#030BFF',
            __typename: 'Attribute',
          },
          {
            id: 'Black',
            displayValue: 'Black',
            value: '#000000',
            __typename: 'Attribute',
          },
          {
            id: 'White',
            displayValue: 'White',
            value: '#FFFFFF',
            __typename: 'Attribute',
          },
        ],
        __typename: 'AttributeSet',
      },
      {
        id: 'Capacity',
        name: 'Capacity',
        type: 'text',
        items: [
          {
            id: '512G',
            displayValue: '512G',
            value: '512G',
            __typename: 'Attribute',
          },
          {
            id: '1T',
            displayValue: '1T',
            value: '1T',
            __typename: 'Attribute',
          },
        ],
        __typename: 'AttributeSet',
      },
    ],
    prices: [
      {
        currency: {
          label: 'USD',
          symbol: '$',
          __typename: 'Currency',
        },
        amount: 844.02,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'GBP',
          symbol: '£',
          __typename: 'Currency',
        },
        amount: 606.67,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'AUD',
          symbol: 'A$',
          __typename: 'Currency',
        },
        amount: 1088.79,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'JPY',
          symbol: '¥',
          __typename: 'Currency',
        },
        amount: 91147.25,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'RUB',
          symbol: '₽',
          __typename: 'Currency',
        },
        amount: 63826.91,
        __typename: 'Price',
      },
    ],
    brand: 'Sony',
    __typename: 'Product',
  },
  {
    id: 'xbox-series-s',
    name: 'Xbox Series S 512GB',
    inStock: false,
    gallery: [
      'https://images-na.ssl-images-amazon.com/images/I/71vPCX0bS-L._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71q7JTbRTpL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71iQ4HGHtsL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/61IYrCrBzxL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/61RnXmpAmIL._SL1500_.jpg',
    ],
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        type: 'swatch',
        items: [
          {
            id: 'Green',
            displayValue: 'Green',
            value: '#44FF03',
            __typename: 'Attribute',
          },
          {
            id: 'Cyan',
            displayValue: 'Cyan',
            value: '#03FFF7',
            __typename: 'Attribute',
          },
          {
            id: 'Blue',
            displayValue: 'Blue',
            value: '#030BFF',
            __typename: 'Attribute',
          },
          {
            id: 'Black',
            displayValue: 'Black',
            value: '#000000',
            __typename: 'Attribute',
          },
          {
            id: 'White',
            displayValue: 'White',
            value: '#FFFFFF',
            __typename: 'Attribute',
          },
        ],
        __typename: 'AttributeSet',
      },
      {
        id: 'Capacity',
        name: 'Capacity',
        type: 'text',
        items: [
          {
            id: '512G',
            displayValue: '512G',
            value: '512G',
            __typename: 'Attribute',
          },
          {
            id: '1T',
            displayValue: '1T',
            value: '1T',
            __typename: 'Attribute',
          },
        ],
        __typename: 'AttributeSet',
      },
    ],
    prices: [
      {
        currency: {
          label: 'USD',
          symbol: '$',
          __typename: 'Currency',
        },
        amount: 333.99,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'GBP',
          symbol: '£',
          __typename: 'Currency',
        },
        amount: 240.07,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'AUD',
          symbol: 'A$',
          __typename: 'Currency',
        },
        amount: 430.85,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'JPY',
          symbol: '¥',
          __typename: 'Currency',
        },
        amount: 36068.27,
        __typename: 'Price',
      },
      {
        currency: {
          label: 'RUB',
          symbol: '₽',
          __typename: 'Currency',
        },
        amount: 25257.22,
        __typename: 'Price',
      },
    ],
    brand: 'Microsoft',
    __typename: 'Product',
  },
];
