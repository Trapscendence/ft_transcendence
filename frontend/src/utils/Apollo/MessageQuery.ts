import { gql } from '@apollo/client';

export const GET_DM_USERS = gql`
  query getDmUsers($offset: Int!, $limit: Int!, $user_id: ID!) {
    dmUsers(offset: $offset, limit: $limit, user_id: $user_id) {
      id
      nickname
    }
  }
`;

// export const SEND_MESSAGE = gql`
//   mutation sendMessage($user_id: ID!, $other_id: ID!, $text: String) {
//     sendMessage(user_id: $user_id, other_id: $other_id, text: $text) {
//       boolean
//     }
//   }
// `;

export const GET_DM = gql`
  query DM($user_id: ID!, $other_id: ID!, $offset: Float!, $limit: Float!) {
    DM(user_id: $user_id, other_id: $other_id) {
      user_id
      other_id
      other_user {
        id
        nickname
      }
      messages(offset: $offset, limit: $limit) {
        id
        received
        content
        checked
        time_stamp
      }
      checked_date
    }
  }
`;
