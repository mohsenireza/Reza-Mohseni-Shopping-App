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
