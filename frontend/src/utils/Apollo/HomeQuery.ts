import { gql } from '@apollo/client';

export const GET_NOTICES = gql`
  query notices($offset: Int!, $limit: Int!) {
    notices(offset: $offset, limit: $limit) {
      writer_id
      writer {
        nickname
      }
      title
      contents
      time_stamp
    }
  }
`;
