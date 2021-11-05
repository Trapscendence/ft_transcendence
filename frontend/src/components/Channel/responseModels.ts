import { ChannelNotifySummary, UserSummary } from '../../utils/models';

export interface SubscribeChannelResponse {
  subscribeChannel: ChannelNotifySummary;
}

export interface GetCurrentParticipantsResponse {
  user: { channel: { participants: UserSummary[] } };
}

export interface LeaveChannelResponse {
  leaveChannel: boolean; // TODO: 맞나?
}
