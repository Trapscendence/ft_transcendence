import { Divider, Grid } from '@mui/material';
import { Box } from '@mui/system';

import ChannelCard from './ChannelCard';
import ChannelListHeader from './ChannelListHeader';

function ChannelListPage(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" p={3} pt={1}>
      <ChannelListHeader />
      {/* <Divider sx={{ my: 2, mx: -3 }} /> */}
      <Divider sx={{ my: 2 }} />
      <Grid container>
        <ChannelCard />
        <ChannelCard />
        <ChannelCard />
        <ChannelCard />
        <ChannelCard />
        <ChannelCard />
      </Grid>
    </Box>
  );
}

export default ChannelListPage;
