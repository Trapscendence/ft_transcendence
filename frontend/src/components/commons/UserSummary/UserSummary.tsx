import { useSubscription } from '@apollo/client';
import { color } from '@mui/lab/node_modules/@mui/system';
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../utils/Apollo/models';
import { UserStatus } from '../../../utils/Apollo/schemaEnums';
import NicknameMenu from '../NicknameMenu';

interface UserSummaryProps {
  IUser: IUser;
  channelId?: string;
}

type colors =
  | 'default'
  | 'secondary'
  | 'primary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | undefined;

interface IUserStatusColor {
  ONLINE: colors;
  IN_RANK_GAME: colors;
  IN_NORMAL_GAME: colors;
  OFFLINE: colors;
}

const UserStatusColor: IUserStatusColor = {
  ONLINE: 'success',
  IN_RANK_GAME: 'primary',
  IN_NORMAL_GAME: 'secondary',
  OFFLINE: undefined,
};

function UserSummary({ IUser, channelId }: UserSummaryProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id, avatar, nickname, status_message, status } = IUser;

  const [currentStatus, setCurrentStatus] = useState(status);

  const { data } = useSubscription<{ statusChange: UserStatus }>(
    gql`
      subscription StatusChange($user_id: ID!) {
        statusChange(user_id: $user_id)
      }
    `,
    {
      variables: { user_id: id },
    }
  );

  useEffect(() => {
    if (!data) return;

    const { statusChange } = data;
    setCurrentStatus(statusChange);
  }, [data]);

  console.log(IUser);

  return (
    <ListItem>
      <ListItemAvatar onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <Badge
          variant="dot"
          overlap="circular"
          color={
            currentStatus
              ? UserStatusColor[currentStatus] ?? undefined
              : undefined
          }
        >
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      {status_message ? (
        <ListItemText
          primary={nickname}
          secondary={status_message}
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
        />
      ) : (
        <ListItemText
          primary={nickname}
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
        />
      )}
      <NicknameMenu {...{ anchorEl, open, handleClose, channelId, id }} />
    </ListItem>
  );
}

export default UserSummary;
