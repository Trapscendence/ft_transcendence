import { useMutation, useQuery } from '@apollo/client';
import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import {
  GET_CHANNELS,
  GET_MY_CHANNEL,
  GET_MY_CHANNEL_ROLE,
  LEAVE_CHANNEL,
} from '../../../utils/gqls';
import handleError from '../../../utils/handleError';
import { IUser } from '../../../utils/models';
import {
  GetMyChannelRoleResponse,
  LeaveChannelResponse,
} from '../../../utils/responseModels';
import ErrorAlert from '../../commons/ErrorAlert';
import LoadingBackdrop from '../../commons/LoadingBackdrop';
import ChannelEditModal from './ChannelEditModal';

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
  const [open, setOpen] = useState(false);

  const { data: channelRoleData, error: channelRoleError } =
    useQuery<GetMyChannelRoleResponse>(GET_MY_CHANNEL_ROLE);

  const [leaveChannel, { loading, error: leaveChannelError }] =
    useMutation<LeaveChannelResponse>(LEAVE_CHANNEL, {
      refetchQueries: [
        GET_MY_CHANNEL,
        { query: GET_CHANNELS, variables: { limit: 0, offset: 0 } },
      ],
    });

  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  const errorVar = leaveChannelError || channelRoleError;

  return (
    <>
      {errorVar && <ErrorAlert name="ChannelHeader" error={errorVar} />}
      {loading && <LoadingBackdrop loading={loading} />}
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
            Administrators:{' '}
            {administrators.map((val) => val.nickname).join(', ')}
          </Typography>
        </Box>
        <Box>
          {channelRoleData && channelRoleData.user.channel_role === 'OWNER' && (
            <Button variant="contained" sx={{ m: 1 }} onClick={handleOpen}>
              Edit Channel
            </Button>
          )}
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => handleError(leaveChannel)}
          >
            Leave Channel
          </Button>
        </Box>
        <ChannelEditModal {...{ open, handleClose, id }} />
      </Paper>
    </>
  );
}
