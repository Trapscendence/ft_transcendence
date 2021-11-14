import { Notify, UserStatus } from './schemaEnums';

export interface IChannelListItem {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface IUser {
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
