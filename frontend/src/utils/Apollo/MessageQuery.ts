import { gql } from '@apollo/client';

export const GET_DM_USERS = gql`
  query getDmUsers($offset: Int!, $limit: Int!) {
    dmUsers(offset: $offset, limit: $limit) {
      id
      nickname
      avatar
    }
  }
`;

//TODO sendMessage가 이제 성공한 메시지를 반환한다고 함, 처리해줄것
export const SEND_MESSAGE = gql`
  mutation sendMessage($other_id: ID!, $text: String!) {
    sendMessage(other_id: $other_id, text: $text) {
      id
      received
      content
      checked
      time_stamp
    }
  }
`;

export const UPDATE_CHECK_DATE = gql`
  mutation updateCheckdate($other_id: ID!) {
    updateCheckdate(other_id: $other_id)
  }
`;

export const GET_DM = gql`
  query DM($other_id: ID!, $offset: Int!, $limit: Int!) {
    DM(other_id: $other_id) {
      messages(offset: $offset, limit: $limit) {
        id
        received
        content
        checked
        time_stamp
      }
    }
  }
`;

export const RECEIVE_MESSAGE = gql`
  subscription getReceiveMessage {
    receiveMessage {
      id
      received
      content
      checked
      time_stamp
    }
  }
`;
