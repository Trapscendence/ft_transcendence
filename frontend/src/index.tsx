import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  makeVar,
  // useQuery,
  // gql,
} from '@apollo/client';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

export const isLoginVar = makeVar(false); // 위치 어디에 해야?
export const tokenVar = makeVar(''); // 따로 폴더를 만들어야하나..?

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
