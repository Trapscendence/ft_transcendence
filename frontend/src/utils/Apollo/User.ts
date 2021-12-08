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
  // winner_points: number;
  loser: User;
  // loser_points: number;
  // type: MatchType!
  time_stamp: string;
}

export interface achievement {
  name: string;
}
export interface MatchData {
  user: {
    id: string;
    nickname: string;
    match_history: Match[];
    achievements: achievement[];
  };
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

export interface UserProfile {
  nickname: string;
  id: string;
  rank: number;
  avatar: string;
}

export interface UserProfileData {
  users: UserProfile[];
}
