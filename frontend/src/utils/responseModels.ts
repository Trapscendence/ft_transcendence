import { IChannel, IChannelListItem, IChannelNotify, IUser } from './models';
import { UserRole } from './schemaEnums';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

// export interface GetMyChannelParticipantsResponse {
//   user: { channel: { participants: IUser[] } };
// }

export interface LeaveChannelResponse {
  leaveChannel: boolean;
}

export interface GetMyBlacklistResponse {
  user: { blacklist: { id: string }[] }; // TODO: 맞나?
}

export interface GetMyChannelMutedUsers {
  user: { channel: { bannedUsers: { id: string; nickname: string } } };
}

export interface GetMyChannelBannedUsers {
  user: { channel: { bannedUsers: { id: string; nickname: string } } };
} // TODO: 스네이크 케이스로 변경 예정

export interface AddChannelResponse {
  addChannel: IChannel;
}

export interface GetMyChannelResponse {
  user: {
    channel: IChannel;
  };
}

export interface GetMyChannelRoleResponse {
  user: {
    channel_role: UserRole;
  };
}

export interface GetChannelsResponse {
  channels: IChannelListItem[];
}

// export interface GetCurrentChannelIdResponse {
//   user: {
//     channel: { id: string };
//   };
// }

export interface EnterChannelResponse {
  enterChannel: {
    channel: IChannel;
  };
}

export interface MuteUserResponse {
  muteUserOnChannel: boolean;
}

export interface BanUserResponse {
  banUserFromChannel: boolean;
}
