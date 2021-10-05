import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  makeVar,
  // useQuery,
  // gql,
} from '@apollo/client';
import App from './App';
import { CssBaseline } from '@mui/material';

const client = new ApolloClient({
  uri: 'https://localhost:4000',
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
