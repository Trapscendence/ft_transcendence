import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { GetCurrentChannelResponse } from '../../ChannelList/responseModels';

interface ChannelHeaderProps {
  channelData: GetCurrentChannelResponse;
}

export default function ChannelHeader({
  channelData,
}: ChannelHeaderProps): JSX.Element {
  const {
    user: {
      channel: {
        title,
        owner: { nickname },
      },
    },
  } = channelData;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography>Title: {title}</Typography>
        <Typography>Owner: {nickname}</Typography>
      </Box>
      <Box>
        <Button variant="contained">Leave Channel</Button>
      </Box>
    </Paper>
  );
}
