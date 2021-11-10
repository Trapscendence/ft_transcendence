import gql from 'graphql-tag';

// TODO: 현재 아바타, 스테이터스 불러오면 에러 발생하는 백엔드 오류 있음.

export const GET_ALL_CHANNELS = gql`
  query GetAllChannels($limit: Float!, $offset: Float!) {
    channels(limit: $limit, offset: $offset) {
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
        id
        nickname
        # avatar
        # status
      }
      administrators {
        id
        nickname
        # avatar
        # status
      }
      participants {
        id
        nickname
        # avatar
        # status
      }
    }
  }
`;

// TODO: 닉네임만 보여주게 구현한 상태지만, 추후에 사진 등도 함께 보여주도록 수정해야

export const GET_CURRENT_CHANNEL = gql`
  query GetCurrentChannel($id: ID!) {
    user(id: $id) {
      channel {
        id
        title
        is_private
        owner {
          id
          nickname
          # avatar
          # status
        }
        administrators {
          id
          nickname
          # avatar
          # status
        }
        participants {
          id
          nickname
          # avatar
          # status
        }
        bannedUsers {
          id
          nickname
        }
        mutedUsers {
          id
          nickname
        }
      }
    }
  }
`;

export const ENTER_CHANNEL = gql`
  mutation EnterChannel($channel_id: ID!, $user_id: ID!) {
    enterChannel(channel_id: $channel_id, user_id: $user_id) {
      id
      title
      is_private
      owner {
        id
        nickname
      }
      administrators {
        id
        nickname
      }
      participants {
        id
        nickname
      }
    }
  }
`;
