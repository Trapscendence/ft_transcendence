import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  makeVar,
  // useQuery,
  // gql,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { Message } from './utils/Apollo/Message';
import { ChannelSummary, ChattingSummary } from './utils/models';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  link: wsLink, // 이렇게?
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chattingMessages: {
            read({ args }) {
              console.log(args);
            },
          },
        },
      },
    },
  }),
});

export const isLoginVar = makeVar(false); // TODO: 위치 어디에 해야? 따로 파일을 만들어야 하려나?
export const tokenVar = makeVar('');
export const userIdVar = makeVar<string | null>('1'); // TODO: User? UserSummary? id? // 로그인이 없으니 그냥 "1"로...
export const channelIdVar = makeVar<string | null>(null);
export const chattingMessagesVar = makeVar<Map<string, ChattingSummary[]>>(
  new Map<string, ChattingSummary[]>()
);
// TODO: chattingSummarysVar 등으로 이름 수정하면 나을듯... 저 작명도 별로지만 T_T
// TODO: 일단은 캐시 생각 안하고 id 등만 저장해서 쿼리 재요청하는 식으로 모두 구현해보자
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
