import gql from 'graphql-tag';

export const CHAT_MESSAGE = gql`
  mutation ChatMessage($message: String!, $user_id: ID!, $channel_id: ID!) {
    chatMessage(message: $message, user_id: $user_id, channel_id: $channel_id)
  }
`; // TODO: 나중에 user_id 등은 쿠키 사용으로 사라질 예정

export const SUBSCRIBE_CHANNEL = gql`
  subscription SubscribeChannel($channel_id: String!) {
    subscribeChannel(channel_id: $channel_id) {
      type
      participant {
        id
        nickname
        # avatar
        # status
      }
      text
      check
    }
  }
`;

export const GET_CHATTING_MESSAGES = gql`
  query getChattingMessages($channel_id: ID!) {
    chattingMessages(channel_id: $channel_id) @client
  }
`;

export const GET_CURRENT_PARTICIPANTS = gql`
  query GetCurrentParticipants($id: ID!) {
    user(id: $id) {
      channel {
        participants {
          id
          nickname
          # avatar
          # status
        }
      }
    }
  }
`;

export const LEAVE_CHANNEL = gql`
  mutation LeaveChannel($channel_id: ID!, $user_id: ID!) {
    leaveChannel(channel_id: $channel_id, user_id: $user_id)
  }
`;

export const GET_MY_BLACKLIST = gql`
  query GetMyBlacklist($id: ID!) {
    user(id: $id) {
      blacklist {
        id
      }
    }
  }
`;
// TODO: 실제로는 필수 아닌데 이렇게 써도 되나?
// TODO: nickname, avatar 등은 안가져와도 되나?

export const GET_CHANNEL_MUTED_USERS = gql`
  query GetChannelMutedUsers($id: ID!) {
    user(id: $id) {
      channel {
        mutedUsers {
          id
          nickname
        }
      }
    }
  }
`;
// TODO: 이미 쓴 쿼리에 대해 (ex. GET_CURRENT_CHANNEL) 부분으로 데이터는 못가져오나?

export const GET_CHANNEL_BANNED_USERS = gql`
  query GetChannelBannedUsers($id: ID!) {
    user(id: $id) {
      channel {
        bannedUsers {
          id
          nickname
        }
      }
    }
  }
`;
// TODO: bannedUsers 등의 필드명이 banned_users로 바뀔 예정
