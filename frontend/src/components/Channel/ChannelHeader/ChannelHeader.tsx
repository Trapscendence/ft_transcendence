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
  const [leaveChannel] = useMutation<LeaveChannelResponse>(LEAVE_CHANNEL, {
    variables: { channel_id: id, user_id: userIdVar() },
    refetchQueries: [
      GET_CURRENT_CHANNEL,
      { query: GET_ALL_CHANNELS, variables: { limit: 0, offset: 0 } },
    ],
  });

  const onClickLeave = () => {
    void leaveChannel();
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
