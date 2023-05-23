import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // Add your authentication logic here
  const token = process.env.NEXT_PUBLIC_WORDPRESS_AUTH_REFRESH_TOKEN;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: "cache-first",
    },
  },
});
