import { IChannel, IChannelListItem, IChannelNotify, IUser } from './models';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

export interface GetCurrentParticipantsResponse {
  user: { channel: { participants: IUser[] } };
}

export interface LeaveChannelResponse {
  leaveChannel: boolean;
}

export interface GetMyBlacklistResponse {
  user: { blacklist: { id: string }[] }; // TODO: 맞나?
}

export interface GetChannelMutedUsers {
  user: { channel: { bannedUsers: { id: string; nickname: string } } };
}

export interface GetChannelBannedUsers {
  user: { channel: { bannedUsers: { id: string; nickname: string } } };
} // TODO: 스네이크 케이스로 변경 예정

export interface AddChannelResponse {
  addChannel: IChannel;
}

export interface GetCurrentChannelResponse {
  user: {
    channel: IChannel;
  };
}

export interface GetAllChannelsResponse {
  channels: IChannelListItem[];
}

export interface GetCurrentChannelIdResponse {
  user: {
    channel: { id: string };
  };
}

export interface EnterChannelResponse {
  enterChannel: {
    channel: IChannel;
  };
}
