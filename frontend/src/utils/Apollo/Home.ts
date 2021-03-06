export interface Notice {
  writer_id: string;
  writer: { nickname: string };
  title: string;
  contents: string;
  time_stamp: string;
}

export interface NoticeData {
  notices: Notice[];
}
export interface NoticeVars {
  offset: number;
  limit: number;
}
