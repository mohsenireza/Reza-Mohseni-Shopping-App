import { gql } from '@apollo/client';

export const categoriesQuery = () => gql`
  query Categories {
    categories {
      name
    }
  }
`;

export const currenciesQuery = () => gql`
  query Currencies {
    currencies {
      label
      symbol
    }
  }
`;

export const productsQuery = () => gql`
  query Products($category: String!) {
    category(input: { title: $category }) {
      products {
        id
        name
        inStock
        gallery
        attributes {
          id
          name
          type
          items {
            id
            displayValue
            value
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;

export const productQuery = () => gql`
  query Product($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
`;

export const cartQuery = (productIds) => {
  const singleProductQueries = productIds.map((productId, index) => {
    return `product${index}: product(id: "${productId}") {
        id
        name
        gallery
        attributes {
          id
          name
          type
          items {
            id
            displayValue
            value
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }`;
  });

  return gql`query Cart {
    ${singleProductQueries}
  }`;
};
