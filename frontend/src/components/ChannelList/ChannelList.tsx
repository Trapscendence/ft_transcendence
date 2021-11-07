import { useQuery, useReactiveVar } from '@apollo/client';
import { Divider } from '@mui/material';
import { Redirect, useHistory } from 'react-router';

import { userIdVar } from '../..';
import Channel from '../Channel';
import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';
import { GET_CURRENT_CHANNEL, GET_CURRENT_CHANNEL_ID } from './gqls';
import {
  GetCurrentChannelIdResponse,
  GetCurrentChannelResponse,
} from './responseModels';

// TODO: channel list는 subscription으로 주기적으로 새로고침하게 하기로 했었나?

export default function ChannelList(): JSX.Element {
  const history = useHistory();

  // TODO: 현재 채널에 들어와있는지 확인하는 방법... 이게 최선일까?
  // const { data, loading, error } = useQuery<GetCurrentChannelResponse>(
  const { data } = useQuery<GetCurrentChannelResponse>(GET_CURRENT_CHANNEL, {
    variables: { id: userIdVar() },
    // onCompleted({ user: { channel } }) {
    //   if (channel) {
    //     history.push(`/channel/${channel.id}`); // NOTE: <Redirect ...> 는 작동을 안했다.
    //   }
    // },
  });

  if (data && data.user.channel) return <Channel channel={data.user.channel} />;

  return (
    <>
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </>
  );
}
