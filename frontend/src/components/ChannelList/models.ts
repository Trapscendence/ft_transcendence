import { ChannelSummary } from '../../utils/models';

export interface AddChannelResponse {
  addChannel: ChannelSummary;
}

export interface GetCurrentChannelResponse {
  user: {
    channel: ChannelSummary;
  };
}
