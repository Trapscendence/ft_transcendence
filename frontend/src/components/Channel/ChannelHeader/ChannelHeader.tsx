import { useMutation } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { userIdVar } from '../../..';
import { IUser } from '../../../utils/models';
import { GET_ALL_CHANNELS, GET_CURRENT_CHANNEL } from '../../ChannelList/gqls';
import { LEAVE_CHANNEL } from '../gqls';
import { LeaveChannelResponse } from '../responseModels';

interface ChannelHeaderProps {
  id: string;
  title: string;
  is_private: boolean;
  owner: IUser;
  administrators: IUser[];
}

export default function ChannelHeader({
  id,
  title,
  is_private,
  owner,
  administrators,
}: ChannelHeaderProps): JSX.Element {
  const [leaveChannel, { data: leaveData }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
      variables: { channel_id: id, user_id: userIdVar() },
      refetchQueries: [GET_CURRENT_CHANNEL, GET_ALL_CHANNELS], // TODO: GET_ALL_CHANNELS 리패치시 오류
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

  const onClickLeave = () => {
    void leaveChannel({
      // variables: { channel_id: channelIdVar(), user_id: userIdVar() },
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
        <Typography>Owner: {owner.nickname}</Typography>
      </Box>
      <Box>
        <Button variant="contained" onClick={onClickLeave}>
          Leave Channel
        </Button>
      </Box>
    </Paper>
  );
}
