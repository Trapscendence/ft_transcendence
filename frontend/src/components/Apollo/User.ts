export interface User {
  id: number;
  nickname: string;
}

export interface UsersData {
  users: User[];
}

export interface UsersDataVars {
  ladder: boolean;
  offset: number;
  limit: number;
}

export interface UserVars {
  id?: string;
  limit?: string;
}
