import { Grid } from '@mui/material';

import ChannelCard from './ChannelCard';

export default function ChannelListContents(): JSX.Element {
  return (
    <Grid container>
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
      <ChannelCard />
    </Grid>
  );
}
