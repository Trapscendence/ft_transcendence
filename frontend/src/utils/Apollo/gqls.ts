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
  query GetMyChannel {
    user {
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
        banned_users {
          id
          nickname
        }
        muted_users {
          id
          nickname
        }
      }
    }
  }
`;

export const GET_MY_CHANNEL_ROLE = gql`
  query GetMyChannelRole {
    user {
      channel_role
    }
  }
`;

export const GET_CHANNEL_ROLE = gql`
  query GetChannelRole($id: ID!) {
    user(id: $id) {
      channel_role
    }
  }
`;

export const GET_MY_BLACKLIST = gql`
  query GetMyBlacklist {
    user {
      blacklist {
        id
        nickname
      }
    }
  }
`;

// export const GET_MY_CHANNEL_MUTED_USERS = gql`
//   query GetMyChannelMutedUsers {
//     user {
//       channel {
//         muted_users {
//           id
//           nickname
//         }
//       }
//     }
//   }
// `;

// export const GET_MY_CHANNEL_BANNED_USERS = gql`
//   query GetMyChannelBannedUsers {
//     user {
//       channel {
//         banned_users {
//           id
//           nickname
//         }
//       }
//     }
//   }
// `;

export const GET_MY_ID = gql`
  query GetMyId {
    user {
      id
    }
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
  mutation EditChannel($title: String!, $password: String) {
    editChannel(title: $title, password: $password) {
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
      banned_users {
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
  mutation ChatMessage($message: String!) {
    chatMessage(message: $message)
  }
`;

export const LEAVE_CHANNEL = gql`
  mutation LeaveChannel {
    leaveChannel
  }
`;

export const MUTE_USER = gql`
  mutation MuteUserOnChannel($mute_time: Int!, $user_id: ID!) {
    muteUserOnChannel(mute_time: $mute_time, user_id: $user_id)
  }
`;

export const KICK_USER = gql`
  mutation KickUserFromChannel($user_id: ID!) {
    kickUserFromChannel(user_id: $user_id)
  }
`;

export const BAN_USER = gql`
  mutation BanUserFromChannel($user_id: ID!) {
    banUserFromChannel(user_id: $user_id)
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

export const DELEGATE_USER_ON_CHANNEL = gql`
  mutation DelegateUserOnChannel($user_id: ID!) {
    delegateUserOnChannel(user_id: $user_id)
  }
`;

export const RELEGATE_USER_ON_CHANNEL = gql`
  mutation RelegateUserOnChannel($user_id: ID!) {
    relegateUserOnChannel(user_id: $user_id)
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

export const SUBSCRIBE_REGISTER = gql`
  subscription SubscribeRegister {
    subscribeRegister {
      type
      game_id
      custom_host_nickname
    }
  }
`;
