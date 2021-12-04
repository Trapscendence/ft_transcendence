import { gql } from '@apollo/client';

export const GET_NOTICES = gql`
  query Notices($offset: Int!, $limit: Int!) {
    Notices(offset: $offset, limit: $limit) {
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
