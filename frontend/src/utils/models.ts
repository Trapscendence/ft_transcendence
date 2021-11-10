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
  status_message?: string;
  status: UserStatus;
}

export interface IChannel {
  id: string;
  title: string;
  is_private: boolean;
  owner: IUser;
  administrators: IUser[];
  participants: IUser[];
  bannedUsers: IUser[];
  mutedUsers: IUser[];
}

export interface IChannelNotify {
  type: Notify;
  participant?: IUser;
  text?: string;
  check?: boolean;
}

export interface IChatting {
  id: string; // NOTE: new Date().getTime().toString()
  participant: IUser;
  text: string;
}

export interface ChannelNotifySummary {
  type: Notify;
  participant?: UserSummary;
  text?: string;
  check?: boolean;
}

export interface ChattingSummary {
  participant: UserSummary;
  text: string;
}
