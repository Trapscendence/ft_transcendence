import { User } from './User';

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
  user_id: string | null;
  other_id: string;
  other_user: string;
  messages: Message[];
  checked_date: string;
}

export interface ReceiveMessageData {
  receiveMessage: Message;
}

export interface SendMessageData {
  sendMessage: Message;
}

export interface DmsData {
  DM: DM;
}

export interface DmUsersVars {
  limit: number;
  offset: number;
  user_id: string | null;
}

export interface DmVars {
  limit: number;
  offset: number;
  user_id: string | null;
  other_id: string;
}
