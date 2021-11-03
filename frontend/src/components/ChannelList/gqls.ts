import gql from 'graphql-tag';

export const GET_ALL_CHANNELS = gql`
  query GetAllChannels {
    channels(limit: 0, offset: 0) {
      id
      title
      is_private
      owner {
        nickname
      }
      participants {
        nickname
      }
    }
  }
`;
