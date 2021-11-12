import { useMutation } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { userIdVar } from '../../..';
import {
  GET_CHANNELS,
  GET_MY_CHANNEL,
  LEAVE_CHANNEL,
} from '../../../utils/gqls';
import { IUser } from '../../../utils/models';
import { LeaveChannelResponse } from '../../../utils/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';

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
  const [leaveChannel, { loading, error }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
      // variables: { channel_id: id, user_id: userIdVar() },
      refetchQueries: [
        GET_MY_CHANNEL,
        { query: GET_CHANNELS, variables: { limit: 0, offset: 0 } },
      ],
    }
  );

  const onClickLeave = () => {
    void leaveChannel();
  };

  if (error) return <ErrorAlert name="ChannelHeader" error={error} />;
  if (loading) return <LoadingBackdrop loading={loading} />;

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
        <Typography>{is_private ? 'Private' : 'Public'}</Typography>
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
