// export interface Achivement {
//   id: string;
//   title: string;
//   content: string;
//   date: number;
// }

// export interface Match {
//   id: string;
//   winner: User;
//   winner_point: number;
//   loser: User;
//   loser_point: number;
//   type: MatchType;
//   time: number;
// }

export enum MatchType {
  RANK,
  CUSTOM,
}

// export interface User {
//   id: string;
//   intra_id: string;
//   nickname: string;
//   avatar: string;
//   status_message?: string;
//   status: UserStatus;
//   friends: User[];
//   blacklist: User[];
//   rank_score: number;
//   rank: number;
//   match_history: Match[];
//   achivements: Achivement[];
//   role: UserRole;
// }

export enum UserStatus {
  ONLINE = 'ONLINE',
  IN_RANK_GAME = 'IN_RANK_GAME',
  IN_NORMAL_GAME = 'IN_NORMAL_GAME',
  OFFLINE = 'OFFLINE',
}

export enum UserRole {
  USER = 'USER',
  // MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}
// TODO: site_role하고 channel_role을 함께 쓰나?

// export interface Channel {
//   id: string;
//   title: string;
//   is_private: boolean;
//   owner: User;
//   administrators: User[];
//   participants: User[];
//   banned_users: User[];
//   muted_users: User[];
// }

// export interface ChannelNotify {
//   type: Notify;
//   participant: User;
//   text: string;
//   check: boolean;
// }

export enum Notify {
  ENTER = 'ENTER',
  CHAT = 'CHAT',
  MUTE = 'MUTE',
  KICK = 'KICK',
  BAN = 'BAN',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}
// NOTE: GraphQL의 enum은 문자형 enum이라 위와 같이 정의해야 한다.
// 사용은 Notify.CHAT과 같이 한다.

export enum GameNotifyType {
  MATCHED = 'MATCHED',
  JOIN = 'JOIN',
  BOOM = 'BOOM',
}

export enum GameType {
  RANK = 'RANK',
  CUSTOM = 'CUSTOM',
}

export enum CanvasNotifyType {
  BALL = 'BALL',
  PADDLE = 'PADDLE',
  START = 'START',
}
