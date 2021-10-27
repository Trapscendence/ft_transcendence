import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers($ladder: Boolean!, $offset: Int!, $limit: Int!) {
    users(ladder: $ladder, offset: $offset, limit: $limit) {
      id
      nickname
    }
  }
`;

export const GET_USER = gql`
  query getUsers($id: String!, $nickname: String!) {
    user(id: $id, nickname: $nickname) {
      id
      nickname
    }
  }
`;
