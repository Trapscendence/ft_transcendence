import { IChannel, IChannelListItem, IChannelNotify } from './models';
import { RegisterNotifyType, UserRole } from './schemaEnums';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

export interface LeaveChannelResponse {
  leaveChannel: boolean;
}

export interface GetMyBlacklistResponse {
  user: { id: string; blacklist: { id: string; nickname: string }[] };
}

export interface AddChannelResponse {
  addChannel: IChannel;
}

export interface EditChannelResponse {
  editChannel: IChannel;
}

export interface GetMyChannelResponse {
  user: {
    id: string;
    channel: IChannel;
  };
}

export interface GetMyChannelRoleResponse {
  user: {
    id: string;
    channel_role: UserRole;
  };
}

export interface GetChannelRoleResponse {
  user: {
    id: string;
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

export interface SubscribeRegisterResponse {
  // subscribeMatch: { id: string };
  subscribeRegister: {
    type: RegisterNotifyType;
    game_id: string;
    custom_host_nickname?: string;
  };
}
