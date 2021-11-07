import { IChannel, IChannelListItem } from '../../utils/models';

export interface AddChannelResponse {
  addChannel: IChannel;
}

export interface GetCurrentChannelResponse {
  user: {
    channel: IChannel;
  };
}

export interface GetAllChannelsResponse {
  channels: IChannelListItem[];
}

export interface GetCurrentChannelIdResponse {
  user: {
    channel: { id: string };
  };
}
