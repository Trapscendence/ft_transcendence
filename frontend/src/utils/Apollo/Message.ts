import { User } from './User';
// export interface SendMessageVars {
//   user_id: string;
//   other_id: string;
//   text: string;
// }

export interface DmUsersData {
  dmUsers: User[];
}

export interface Message {
  id: string;
  received: boolean;
  content: string;
  checked: boolean;
  time_stamp: string;
}

export interface DM {
  user_id: string;
  other_id: string;
  other_user: string;
  messages: Message[];
  checked_date: string;
}

export interface DmsData {
  DM: DM[];
}

export interface DmUsersVars {
  limit: number;
  offset: number;
  user_id: string;
}

export interface DmVars {
  limit: number;
  offset: number;
  user_id: string;
  other_id: string;
}
