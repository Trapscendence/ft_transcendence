export interface User {
  nickname: string;
  id: string;
  avatar: string;
}

export interface NickName {
  nickname: string;
}

export interface UserData {
  user: User;
}
export interface Match {
  id: string;
  winner: User;
  winner_points: number;
  loser: User;
  loser_points: number;
  // type: MatchType!
  time_stamp: string;
}

export interface MatchData {
  user: { id: string; nickname: string; Match: Match[] };
}
export interface UsersData {
  users: User[];
}

export interface CurrentUsersData {
  user: User[];
}

export interface UsersDataVars {
  ladder: boolean;
  offset: number;
  limit: number;
}

export interface MatchDataVars {
  nickname: string;
  offset: number;
  limit: number;
}
