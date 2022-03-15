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
