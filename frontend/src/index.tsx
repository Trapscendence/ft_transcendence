import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
  makeVar,
  split,
  // useQuery,
  // gql,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { IChatting } from './utils/Apollo/models';

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_SERVER_HOST ?? 'localhost'}:${
    process.env.REACT_APP_SERVER_PORT ?? '3000'
  }/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      credential: 'include',
    },
  },
});

const uploadLink = createUploadLink({
  uri: `http://${process.env.REACT_APP_SERVER_HOST ?? 'localhost'}:${
    process.env.REACT_APP_SERVER_PORT ?? '3000'
  }/graphql`,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
          null,
          4
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        )}, Path: ${path}`
      )
    );
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, splitLink, uploadLink]),

  cache: new InMemoryCache({
    // typePolicies: {
    //   Query: {
    //     fields: {
    //       chattingMessages: {
    //         read({ args }) {
    //           console.log(args);
    //         },
    //       },
    //     },
    //   },
    // },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export const userIdVar = makeVar<string | null>(null);
export const chattingMessagesVar = makeVar<Map<string, IChatting[]>>(
  new Map<string, IChatting[]>()
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#7e57c2',
    },
    secondary: {
      main: '#9ad2cc',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { overflowY: 'hidden' }, // NOTE: html이 아니라 body에 주로 적용하는 듯
          }}
        />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
