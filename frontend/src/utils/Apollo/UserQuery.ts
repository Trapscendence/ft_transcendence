import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers($ladder: Boolean!, $offset: Int!, $limit: Int!) {
    users(ladder: $ladder, offset: $offset, limit: $limit) {
      id
      nickname
    }
  }
`;

export const GET_USER_BY_NICKNAME = gql`
  query getUser($nickname: String) {
    user(nickname: $nickname) {
      id
      nickname
    }
  }
`;
