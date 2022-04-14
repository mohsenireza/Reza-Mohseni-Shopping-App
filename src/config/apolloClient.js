import { ApolloClient, InMemoryCache } from '@apollo/client';
import { API_BASE_URL } from '../constants';

const client = new ApolloClient({
  uri: API_BASE_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

export { client };
