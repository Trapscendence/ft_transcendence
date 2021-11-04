import { UserStatus } from './schemas';

export interface ChannelListItem {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface ChannelListSummary {
  channels: ChannelListItem[];
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
