import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';

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
  const history = useHistory();

  const [leaveChannel, { data: leaveData }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
      // variables: { channel_id: channelId, user_id: userId },
      onCompleted: () => {
        channelIdVar(null); // TODO: 이렇게 하면 안될것같은데 // 위로 올리면 얼리리턴일텐데
        history.push('/channel');
      },
    }
  );
  // useEffect(() => {
  //   return () => {
  //     console.log('leaveData?.leaveChannel', leaveData?.leaveChannel);
  //     console.log('channelIdVar', channelIdVar());
  //     console.log('leaveData', leaveData);
  //     if (leaveData?.leaveChannel) {
  //       // TODO: 조건문에 쓰면 안되려나..?
  //       channelIdVar(null);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log('leaveData', leaveData);
  //   // channelIdVar(null);
  //   if (leaveData?.leaveChannel) channelIdVar(null);
  // }, [leaveData]);

  const {
    user: {
      channel: {
        title,
        owner: { nickname },
      },
    },
  } = channelData;

  const onClickLeave = () => {
    void leaveChannel({
      variables: { channel_id: channelIdVar(), user_id: userIdVar() },
    });

    // // return <Redirect to="/channel" />;
    // // history.push('/channel');
    // history.push('/rank');
  };

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
        <Button variant="contained" onClick={onClickLeave}>
          Leave Channel
        </Button>
      </Box>
    </Paper>
  );
}
