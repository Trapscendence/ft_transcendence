export interface ChannelSummary {
  id: string;
  title: string;
  is_private: boolean;
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface ChannelSummaryData {
  channels: ChannelSummary[];
}
