import gql from 'graphql-tag';

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

export const BAN_USER = gql`
  mutation BanUserFromChannel($user_id: ID!, $channel_id: ID!) {
    banUserFromChannel(user_id: $user_id, channel_id: $channel_id)
  }
`;
