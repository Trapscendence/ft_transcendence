import { Notify, UserStatus } from './schemaEnums';

export interface ChannelListSummary {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface UserSummary {
  id: string;
  nickname: string;
  avatar: string;
  status: UserStatus;
}

export interface ChannelSummary {
  id: string;
  title: string;
  is_private: boolean;
  owner: UserSummary;
  administrators: UserSummary[];
  participants: UserSummary[];
}

export interface ChannelNotifySummary {
  type: Notify;
  participant?: UserSummary;
  text?: string;
  check?: boolean;
}

export interface ChattingSummary {
  id: string;
  participant: UserSummary;
  text: string;
}
