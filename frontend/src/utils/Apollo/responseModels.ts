import { IChannel, IChannelListItem, IChannelNotify } from './models';
import { UserRole } from './schemaEnums';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

export interface LeaveChannelResponse {
  leaveChannel: boolean;
}

export interface GetMyBlacklistResponse {
  user: { blacklist: { id: string; nickname: string }[] };
}

export interface AddChannelResponse {
  addChannel: IChannel;
}

export interface EditChannelResponse {
  editChannel: IChannel;
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

export interface GetChannelRoleResponse {
  user: {
    channel_role: UserRole;
  };
}

export interface GetChannelsResponse {
  channels: IChannelListItem[];
}

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

export interface KickUserResponse {
  kickUserFromChannel: boolean;
}

export interface GetMyIdResponse {
  user: { id: string };
}

export interface AddToBlackListResponse {
  addToBlackList: boolean;
}

export interface DeleteFromBlackListResponse {
  deleteFromBlackList: boolean;
}

export interface DelegateUserOnChannelResponse {
  delegateUserOnChannel: boolean;
}

export interface RelegateUserOnChannelResponse {
  relegateUserOnChannel: boolean;
}
