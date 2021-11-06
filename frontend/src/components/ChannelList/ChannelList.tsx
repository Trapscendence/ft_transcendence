import { useQuery, useReactiveVar } from '@apollo/client';
import { Divider } from '@mui/material';
import { Redirect, useHistory } from 'react-router';

import { channelIdVar, userIdVar } from '../..';
import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';
import { GET_CURRENT_CHANNEL_ID } from './gqls';
import { GetCurrentChannelIdResponse } from './responseModels';

// TODO: channel list는 subscription으로 주기적으로 새로고침하게 하기로 했었나?

export default function ChannelList(): JSX.Element {
  const channelId = useReactiveVar(channelIdVar);
  const userId = useReactiveVar(userIdVar);
  const history = useHistory();

  if (channelId) {
    return <Redirect to={`/channel/${channelId}`} />;
    // history.push(`/channel/${currentChannel.id}`);
  }

  // TODO: 현재 채널에 들어와있는지 확인하는 방법... 이게 최선일까?
  // const { data, loading, error } = useQuery<GetCurrentChannelResponse>(
  useQuery<GetCurrentChannelIdResponse>(GET_CURRENT_CHANNEL_ID, {
    variables: { id: userId },
    onCompleted({ user: { channel } }) {
      if (channel) {
        history.push(`/channel/${channel.id}`); // NOTE: <Redirect ...> 는 작동을 안했다.
        // currentChannelVar(channel); // TODO: 괜찮나..? 모르겠다.
        channelIdVar(channel.id); // TODO: 괜찮나..? 모르겠다.
      }
    },
  });

  return (
    <>
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </>
  );
}
