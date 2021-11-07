import { IChannelNotify, IUser } from '../../utils/models';

export interface SubscribeChannelResponse {
  subscribeChannel: IChannelNotify;
}

export interface GetCurrentParticipantsResponse {
  user: { channel: { participants: IUser[] } };
}

export interface LeaveChannelResponse {
  leaveChannel: boolean; // TODO: 맞나?
}
