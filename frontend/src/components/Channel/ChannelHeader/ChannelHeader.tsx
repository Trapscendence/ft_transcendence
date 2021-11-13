import { useMutation } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

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
  id, // NOTE: setting에서 사용되지 않을까? 근데 그러려면 ban 목록도 있어야하지 않나?
  title,
  is_private,
  owner,
  administrators,
}: ChannelHeaderProps): JSX.Element {
  const [leaveChannel, { loading, error }] = useMutation<LeaveChannelResponse>(
    LEAVE_CHANNEL,
    {
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
        <Typography>
          Administrators: {administrators.map((val) => val.nickname).join(', ')}
        </Typography>
      </Box>
      <Box>
        <Button variant="contained" onClick={onClickLeave}>
          Leave Channel
        </Button>
      </Box>
    </Paper>
  );
}
