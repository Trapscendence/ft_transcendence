import { ChannelNotifySummary, UserSummary } from '../../utils/models';

export interface SubscribeChannelResponse {
  subscribeChannel: ChannelNotifySummary;
}

export interface GetCurrentParticipantsResponse {
  user: { channel: { participants: UserSummary[] } };
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
