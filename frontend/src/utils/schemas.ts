export interface Achivement {
  id: string;
  title: string;
  content: string;
  date: number;
}

export interface Match {
  id: string;
  winner: User;
  winner_point: number;
  loser: User;
  loser_point: number;
  type: MatchType;
  time: number;
}

export enum MatchType {
  RANK,
  CUSTOM,
}

export interface User {
  id: string;
  intra_id: string;
  nickname: string;
  avatar: string;
  status_message?: string;
  status: UserStatus;
  friends: User[];
  blacklist: User[];
  rank_score: number;
  rank: number;
  match_history: Match[];
  achivements: Achivement[];
  role: UserRole;
}

export enum UserStatus {
  ONLINE,
  IN_RANK_GAME,
  IN_NORMAL_GAME,
  OFFLINE,
}

export enum UserRole {
  USER,
  MODERATOR,
  OWNER,
}

export interface Channel {
  id: string;
  title: string;
  is_private: boolean;
  owner: User;
  administrators: User[];
  participants: User[];
  bannedUsers: User[];
  mutedUsers: User[];
}

export interface ChannelNotify {
  type: Notify;
  participant: User;
  text: string;
  check: boolean;
}

export enum Notify {
  INOUT,
  CHAT,
  MUTE,
  KICK,
  BAN,
  EDIT,
  DELETE,
}
