export interface ChannelSummary {
  id: string;
  title: string;
  isPrivate: boolean; // TODO: 아직 private임. 바뀐거 확인해야
  owner: { nickname: string };
  participants: { nickname: string }[];
}

export interface ChannelSummaryData {
  channels: ChannelSummary[];
}
