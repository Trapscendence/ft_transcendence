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
  const { data, refetch } = useQuery<GetCurrentChannelResponse>(
    GET_CURRENT_CHANNEL,
    {
      variables: { id: userIdVar() },
    }
  );

  if (data && data.user.channel)
    return <Channel channel={data.user.channel} channelRefetch={refetch} />;

  return (
    <>
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </>
  );
}
