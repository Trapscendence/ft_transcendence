import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
  // useQuery,
  // gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Test from './Test';
import { IChatting } from './utils/models';

const cookieParser = (name: string): string | undefined => {
  const matches = new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_BACKEND_HOST ?? ''}:${
    process.env.REACT_APP_BACKEND_PORT ?? ''
  }/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: cookieParser('access_token')
        ? `Bearer ${cookieParser('access_token') ?? ''}`
        : '',
    },
  },
});

const httpLink = createHttpLink({
  uri: `http://${process.env.REACT_APP_BACKEND_HOST ?? ''}:${
    process.env.REACT_APP_BACKEND_PORT ?? ''
  }/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token: string | undefined = cookieParser('access_token');
  return {
    /**
     * FIXME: Unsafe assignment of an `any` value. eslint(@typescript-eslint/no-unsafe-assignment)
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
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
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
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
// export const channelIdVar = makeVar<string | null>(null);
export const chattingMessagesVar = makeVar<Map<string, IChatting[]>>(
  new Map<string, IChatting[]>()
);
// TODO: chattingSummarysVar 등으로 이름 수정하면 나을듯... 저 작명도 별로지만 T_T
// TODO: 일단은 캐시 생각 안하고 id 등만 저장해서 쿼리 재요청하는 식으로 모두 구현해보자

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
      {/* <Test></Test> */}
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
