import { ChannelListSummary, ChannelSummary } from '../../utils/models';

export interface AddChannelResponse {
  addChannel: ChannelSummary;
}

export interface GetCurrentChannelResponse {
  user: {
    channel: ChannelSummary;
  };
}

export interface GetAllChannelsResponse {
  channels: ChannelListSummary[];
}

export interface GetCurrentChannelIdResponse {
  user: {
    channel: { id: string };
  };
}
