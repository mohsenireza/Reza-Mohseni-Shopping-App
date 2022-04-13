import { ApolloClient, InMemoryCache } from '@apollo/client';
import { API_BASE_URL } from '../constants';

const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      fields: {
        attributes: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: API_BASE_URL,
  cache,
});

export { client };
