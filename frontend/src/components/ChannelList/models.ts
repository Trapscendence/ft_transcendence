export interface GetAllChannelsResponse {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface GetAllChannelsResponses {
  channels: GetAllChannelsResponse[];
}

export interface AddChannelResponse {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  administrators: { nickname: string }[];
  participants: { nickname: string }[];
}
