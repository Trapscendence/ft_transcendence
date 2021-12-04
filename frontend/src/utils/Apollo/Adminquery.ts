import gql from 'graphql-tag';

export const WRITE_NOTICE = gql`
  mutation writeNotice($contents: String!, $title: String!) {
    writeNotice(contents: $contents, title: $contents)
  }
`;

export const DELETE_NOTICE = gql`
  mutation deleteNotice($time_stamp: String!) {
    deleteNotice(time_stamp: $time_stamp)
  }
`;
