import gql from 'graphql-tag';

/*
 ** ANCHOR: Query
 */

export const GET_CHANNELS = gql`
  query GetChannels($limit: Int!, $offset: Int!) {
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

export const GET_MY_CHANNEL = gql`
  query GetMyChannel($id: ID!) {
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

export const GET_MY_CHANNEL_ROLE = gql`
  query GetMyChannelRole($id: ID!) {
    user(id: $id) {
      channel_role
    }
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

export const GET_MY_CHANNEL_MUTED_USERS = gql`
  query GetMyChannelMutedUsers($id: ID!) {
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

export const GET_MY_CHANNEL_BANNED_USERS = gql`
  query GetMyChannelBannedUsers($id: ID!) {
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

export const WHO_AM_I = gql`
  query whoAmI {
    whoAmI
  }
`;

/*
 ** ANCHOR: Mutation
 */

export const ADD_CHANNEL = gql`
  mutation AddChannel($title: String!, $password: String) {
    addChannel(title: $title, password: $password) {
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
// NOTE: 현재 아바타, 스테이터스 불러오면 에러 발생하는 백엔드 오류 있어 주석 처리

export const EDIT_CHANNEL = gql`
  mutation EditChannel($title: String!, $password: String, $channel_id: ID!) {
    editChannel(title: $title, password: $password, channel_id: $channel_id) {
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
      }
    }
  }
`;

export const ENTER_CHANNEL = gql`
  mutation EnterChannel($channel_id: ID!) {
    enterChannel(channel_id: $channel_id) {
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

export const CHAT_MESSAGE = gql`
  mutation ChatMessage($message: String!, $user_id: ID!, $channel_id: ID!) {
    chatMessage(message: $message, user_id: $user_id, channel_id: $channel_id)
  }
`;

export const LEAVE_CHANNEL = gql`
  mutation LeaveChannel {
    leaveChannel
  }
`;

export const MUTE_USER = gql`
  mutation MuteUserOnChannel(
    $mute_time: Int!
    $user_id: ID!
    $channel_id: ID!
  ) {
    muteUserOnChannel(
      mute_time: $mute_time
      user_id: $user_id
      channel_id: $channel_id
    )
  }
`;

export const BAN_AND_KICK_USER = gql`
  mutation BanAndKickUserFromChannel($user_id: ID!, $channel_id: ID!) {
    banUserFromChannel(user_id: $user_id, channel_id: $channel_id)
    kickUserFromChannel(user_id: $user_id, channel_id: $channel_id)
  }
`;

export const ADD_TO_BLACKLIST = gql`
  mutation AddToBlackList($black_id: ID!) {
    addToBlackList(black_id: $black_id)
  }
`;

export const DELETE_FROM_BLACKLIST = gql`
  mutation DeleteFromBlackList($black_id: ID!) {
    deleteFromBlackList(black_id: $black_id)
  }
`;

/*
 ** ANCHOR: Subscription
 */

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
