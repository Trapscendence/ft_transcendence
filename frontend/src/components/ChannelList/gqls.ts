import gql from 'graphql-tag';

export const GET_CHANNELS = gql`
  query GetChannels {
    channels {
      id
      title
      private
      owner {
        nickname
      }
      participants {
        nickname
      }
    }
  }
`;
