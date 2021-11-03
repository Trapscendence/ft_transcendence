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

export const ADD_CHANNEL = gql`
  mutation AddChannel(
    $owner_user_id: String!
    $title: String!
    $password: String
  ) {
    addChannel(
      owner_user_id: $owner_user_id
      title: $title
      password: $password
    ) {
      id
      title
      is_private
      owner {
        nickname
      }
      administrators {
        nickname
      }
      participants {
        nickname
      }
    }
  }
`;

// TODO: 닉네임만 보여주게 구현한 상태지만, 추후에 사진 등도 함께 보여주도록 수정해야
