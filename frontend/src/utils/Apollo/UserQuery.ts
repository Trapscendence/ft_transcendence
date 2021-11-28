import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers($ladder: Boolean!, $offset: Int!, $limit: Int!) {
    users(ladder: $ladder, offset: $offset, limit: $limit) {
      id
      nickname
      rank
      avatar
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    user {
      id
      nickname
      avatar
    }
  }
`;

export const CHANGE_NICKNAME = gql`
  mutation changeNickname($new_nickname: String!) {
    changeNickname(new_nickname: $new_nickname)
  }
`;

export const CREATE_TFA = gql`
  mutation createTfa {
    createTfa
  }
`;

export const DELETE_TFA = gql`
  mutation deleteTfa {
    deleteTfa
  }
`;

export const GET_USER_BY_NICKNAME = gql`
  query getUser($nickname: String) {
    user(nickname: $nickname) {
      id
      nickname
      avatar
    }
  }
`;

export const GET_MATCH_BY_NICKNAME = gql`
  query getMatch($nickname: String, $offset: Int!, $limit: Int!) {
    user(nickname: $nickname) {
      id
      nickname
      match_history(offset: $offset, limit: $limit)
    }
  }
`;
