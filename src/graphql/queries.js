import { gql } from '@apollo/client';

export const categoriesQuery = gql`
  query categories {
    categories {
      name
    }
  }
`;

export const currenciesQuery = gql`
  query currencies {
    currencies {
      label
      symbol
    }
  }
`;

export const productsQuery = gql`
  query products($category: String!) {
    category(input: { title: $category }) {
      products {
        id
        name
        inStock
        gallery
        prices {
          currency {
            label
            symbol
          }
          amount
        }
      }
    }
  }
`;

export const productQuery = gql`
  query product($id: String!) {
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
