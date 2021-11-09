import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';

import { IUser } from '../../../utils/models';
import { UserStatus } from '../../../utils/schemaEnums';
import NicknameMenu from '../NicknameMenu';

interface UserSummaryProps {
  IUser: IUser;
  channelId?: string;
}

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

  return (
    <ListItem>
      <ListItemAvatar onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <Badge variant="dot" overlap="circular" color="secondary">
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
