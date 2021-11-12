import { useQuery } from '@apollo/client';
import { Divider } from '@mui/material';

import { userIdVar } from '../..';
import { GET_MY_CHANNEL } from '../../utils/gqls';
import { GetMyChannelResponse } from '../../utils/responseModels';
import Channel from '../Channel';
import ErrorAlert from '../commons/ErrorAlert';
import LoadingBackdrop from '../commons/LoadingBackdrop';
import ChannelListContents from './ChannelListContents';
import ChannelListHeader from './ChannelListHeader';

export default function ChannelList(): JSX.Element {
  const { data, loading, error, refetch } = useQuery<GetMyChannelResponse>(
    GET_MY_CHANNEL,
    {
      variables: { id: userIdVar() },
      // onCompleted: (data) => {
      //   console.log(data);
      // },
    }
  );

  if (data && data.user.channel)
    return <Channel channel={data.user.channel} channelRefetch={refetch} />;

  if (error) return <ErrorAlert name="ChannelList" error={error} />;
  if (loading) return <LoadingBackdrop loading={loading} />;

  return (
    <>
      <ChannelListHeader />
      <Divider sx={{ my: 2, mx: -3 }} />
      <ChannelListContents />
    </>
  );
}

// TODO: subscription으로 데이터 갱신하도록 추후 개선
