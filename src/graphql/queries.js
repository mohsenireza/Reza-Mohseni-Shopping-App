import { gql } from '@apollo/client';

export const categoriesQuery = () => gql`
  query categories {
    categories {
      name
    }
  }
`;

export const currenciesQuery = () => gql`
  query currencies {
    currencies {
      label
      symbol
    }
  }
`;

export const productsQuery = ({ category }) => gql`
  query products {
    category(input: { title: "${category}" }) {
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
