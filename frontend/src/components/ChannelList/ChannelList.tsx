import { useQuery } from '@apollo/client';
import { Divider } from '@mui/material';

import { userIdVar } from '../..';
import { GET_CURRENT_CHANNEL } from '../../utils/gqls';
import { GetCurrentChannelResponse } from '../../utils/responseModels';
import Channel from '../Channel';
import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';

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
