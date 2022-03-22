const fakeShoesProduct = {
  id: 'huarache-x-stussy-le',
  name: 'Nike Air Huarache Le',
  inStock: true,
  gallery: [
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_2_720x.jpg?v=1612816087',
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_1_720x.jpg?v=1612816087',
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_3_720x.jpg?v=1612816087',
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_5_720x.jpg?v=1612816087',
    'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_4_720x.jpg?v=1612816087',
  ],
  description: '<p>Great sneakers for everyday use!</p>',
  category: 'clothes',
  attributes: [
    {
      id: 'Size',
      name: 'Size',
      type: 'text',
      items: [
        {
          id: '40',
          displayValue: '40',
          value: '40',
          __typename: 'Attribute',
        },
        {
          id: '41',
          displayValue: '41',
          value: '41',
          __typename: 'Attribute',
        },
        {
          id: '42',
          displayValue: '42',
          value: '42',
          __typename: 'Attribute',
        },
        {
          id: '43',
          displayValue: '43',
          value: '43',
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
      amount: 144.69,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'GBP',
        symbol: '£',
        __typename: 'Currency',
      },
      amount: 104,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'AUD',
        symbol: 'A$',
        __typename: 'Currency',
      },
      amount: 186.65,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'JPY',
        symbol: '¥',
        __typename: 'Currency',
      },
      amount: 15625.24,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'RUB',
        symbol: '₽',
        __typename: 'Currency',
      },
      amount: 10941.76,
      __typename: 'Price',
    },
  ],
  brand: 'Nike x Stussy',
  __typename: 'Product',
};

const fakeIphone12Product = {
  id: 'apple-iphone-12-pro',
  name: 'iPhone 12 Pro',
  inStock: true,
  gallery: [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&amp;hei=1112&amp;fmt=jpeg&amp;qlt=80&amp;.v=1604021663000',
  ],
  description: 'This is iPhone 12. Nothing else to say.',
  category: 'tech',
  attributes: [
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
  ],
  prices: [
    {
      currency: {
        label: 'USD',
        symbol: '$',
        __typename: 'Currency',
      },
      amount: 1000.76,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'GBP',
        symbol: '£',
        __typename: 'Currency',
      },
      amount: 719.34,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'AUD',
        symbol: 'A$',
        __typename: 'Currency',
      },
      amount: 1290.99,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'JPY',
        symbol: '¥',
        __typename: 'Currency',
      },
      amount: 108074.6,
      __typename: 'Price',
    },
    {
      currency: {
        label: 'RUB',
        symbol: '₽',
        __typename: 'Currency',
      },
      amount: 75680.48,
      __typename: 'Price',
    },
  ],
  brand: 'Apple',
  __typename: 'Product',
};

const fakePs5Product = {
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
  description:
    '<p>A good gaming console. Plays games of PS4! Enjoy if you can buy it mwahahahaha</p>',
  category: 'tech',
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
};

export { fakeShoesProduct, fakeIphone12Product, fakePs5Product };
