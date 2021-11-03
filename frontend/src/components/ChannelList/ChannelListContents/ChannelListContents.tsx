import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';

import { GET_ALL_CHANNELS } from '../gqls';
import { GetAllChannelsResponses } from '../models';
import ChannelCard from './ChannelCard';

// interface ChannelListContentsProps {
//   channels: ChannelSummary[];
// }

export default function ChannelListContents(): JSX.Element {
  const { data, loading, error } =
    useQuery<GetAllChannelsResponses>(GET_ALL_CHANNELS);

  if (error) return <p>error! 나중에 대체</p>;
  if (loading) return <p>loading... 나중에 대체</p>;

  return (
    <Grid container>
      {data?.channels.map((val) => (
        <ChannelCard key={val.id} channelSummary={val} />
      ))}

      {/* <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard /> */}
    </Grid>
  );
}
