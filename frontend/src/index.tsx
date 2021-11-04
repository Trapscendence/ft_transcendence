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
import { ChannelSummary } from './utils/models';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

export const isLoginVar = makeVar(false); // TODO: 위치 어디에 해야? 따로 파일을 만들어야 하려나?
export const tokenVar = makeVar('');
export const userIdVar = makeVar<string | null>('1'); // TODO: User? UserSummary? id? // 로그인이 없으니 그냥 "1"로...
export const currentChannelVar = makeVar<ChannelSummary | null>(null); // TODO: id만 저장하는게 좋을지... 아니면 캐시때문에 많은 정보 저장하는게 좋을지를 모르겠다.

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
