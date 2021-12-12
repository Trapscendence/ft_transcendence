import { Notify, UserStatus } from './schemaEnums';

export interface IChannelListItem {
  id: string;
  title: string;
  is_private: boolean;
  owner: { id: string; nickname: string };
  participants: { id: string; nickname: string }[];
}

export interface IUser {
  id: string;
  nickname: string;
  avatar?: string; // NOTE: 백엔드의 미구현으로 임시 ?처리
  status_message?: string;
  status?: UserStatus;
}

export interface IChannel {
  id: string;
  title: string;
  is_private: boolean;
  owner: IUser;
  administrators: IUser[];
  participants: IUser[];
  banned_users: IUser[];
  muted_users: IUser[];
}

export interface IChannelNotify {
  type: Notify;
  participant?: IUser;
  text?: string;
  check?: boolean;
}

export interface IChatting {
  id: string; // NOTE: new Date().getTime().toString()
  participant: IUser;
  text: string;
}

// export interface IMatch {
//   id: string;
//   left_player: {
//     id: string;
//     nickname: string;
//   };
//   right_player: {
//     id: string;
//     nickname: string;
//   };
// }

export interface ICanvasInfo {
  ball_x: number;
  ball_y: number;
  ball_dx: number;
  ball_dy: number;
  left_paddle_y: number;
  left_paddle_dy: number;
  right_paddle_y: number;
  right_paddle_dy: number;
}

export interface BallInfo {
  ball_x: number;
  ball_y: number;
  ball_dx: number;
  ball_dy: number;
}

export interface PaddleInfo {
  left_paddle_y: number;
  left_paddle_dy: number;
  right_paddle_y: number;
  right_paddle_dy: number;
}
