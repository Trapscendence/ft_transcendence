import { IChannel, IChannelListItem, IChannelNotify } from './models';
import { UserRole } from './schemaEnums';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

export interface LeaveChannelResponse {
  leaveChannel: boolean;
}

export interface GetMyBlacklistResponse {
  user: { blacklist: { id: string }[] };
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

export interface BanAndKickUserResponse {
  banUserFromChannel: boolean;
  kickUserFromChannel: boolean;
}

export interface WhoAmIResponse {
  whoAmI: number;
}

export interface AddToBlackListResponse {
  addToBlackList: boolean;
}

export interface DeleteFromBlackListResponse {
  deleteFromBlackList: boolean;
}
