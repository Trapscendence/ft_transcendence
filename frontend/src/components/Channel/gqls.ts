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
`; // TODO: 아직 백엔드의 owner 양도 기능이 없어서 나가기 버튼 누르면 오류 발생함
