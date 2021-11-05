import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';

import { channelIdVar, chattingMessagesVar, userIdVar } from '../../..';
import { GetCurrentChannelResponse } from '../../ChannelList/responseModels';
import { LEAVE_CHANNEL } from '../gqls';
import { LeaveChannelResponse } from '../responseModels';

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

  const channelId = useReactiveVar(channelIdVar);
  const userId = useReactiveVar(userIdVar);
  // const chattingMessages = useReactiveVar(chattingMessagesVar);

  const [leaveChannel, { data }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
      variables: { channel_id: channelId, user_id: userId },
      // onCompleted: () => {
      //   channelIdVar(null);
      // },
    }
  );

  useEffect(() => {
    let newId = null;
    if (!data || !data.leaveChannel) {
      newId = channelIdVar();
    }
    console.log(newId);
    channelIdVar(newId);
  }, [data]);

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
        <Button variant="contained" onClick={() => leaveChannel()}>
          Leave Channel
        </Button>
      </Box>
    </Paper>
  );
}
