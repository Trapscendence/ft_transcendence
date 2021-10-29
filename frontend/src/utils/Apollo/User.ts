export interface User {
  nickname: string;
  id?: number;
}

export interface UserData {
  user: User[];
}

export interface UsersData {
  users: User[];
}

export interface UsersDataVars {
  ladder: boolean;
  offset: number;
  limit: number;
}
