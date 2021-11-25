export interface User {
  nickname: string;
  id: string;
}

export interface NickName {
  nickname: string;
}

export interface UserData {
  user: User;
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
