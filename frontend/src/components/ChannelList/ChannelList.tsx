import { useQuery } from '@apollo/client';
import { Divider } from '@mui/material';

import { GET_MY_CHANNEL } from '../../utils/Apollo/gqls';
import { GetMyChannelResponse } from '../../utils/Apollo/responseModels';
import Channel from '../Channel';
import ErrorAlert from '../commons/ErrorAlert';
import LoadingBackdrop from '../commons/LoadingBackdrop';
import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';

export default function ChannelList(): JSX.Element {
  const { data, loading, error, refetch } =
    useQuery<GetMyChannelResponse>(GET_MY_CHANNEL);

  if (data?.user?.channel)
    return <Channel channel={data.user.channel} channelRefetch={refetch} />;

  return (
    <>
      {error && <ErrorAlert name="ChannelList" error={error} />}
      {loading && <LoadingBackdrop loading={loading} />}
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </>
  );
}

// TODO: subscription으로 데이터 갱신하도록 추후 개선
