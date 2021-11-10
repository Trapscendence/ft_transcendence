import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';

import { GET_CHANNELS } from '../../../utils/gqls';
import { GetChannelsResponse } from '../../../utils/responseModels';
import ChannelCard from './ChannelCard';

export default function ChannelListContents(): JSX.Element {
  const { data, loading, error } = useQuery<GetChannelsResponse>(GET_CHANNELS, {
    variables: { limit: 0, offset: 0 },
    // pollInterval: 5000, // NOTE: 5초마다 polling하려면 이렇게. 일단은 주석처리는 해놓음.
  });

  if (error) return <p>error: {error.message}</p>;
  if (loading) return <p>loading... 나중에 대체</p>;

  return (
    <Grid container>
      {data?.channels.map((val) => (
        <ChannelCard key={val.id} channelSummary={val} />
      ))}
    </Grid>
  );
}
