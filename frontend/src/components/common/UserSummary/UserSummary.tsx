import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';

import NicknameMenu from '../NicknameMenu';

interface UserSummaryProps {
  avatar?: string;
  nickname: string;
  statusMessage?: string;
}

function UserSummary({
  avatar,
  nickname,
  statusMessage,
}: UserSummaryProps): JSX.Element {
  // 상태를 SocialDrawer에서 관리할 수는 없을까? (옮길 수 없을까?)
  // common component에 상태가 있는게 조금 불편하다!
  // anchorEl에 대한 공부가 필요
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 상태에 따라 다르게 나타나야... 뱃지랑 메뉴가 달라야함
  return (
    <ListItem>
      <ListItemAvatar>
        <Badge variant="dot" overlap="circular" color="secondary">
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      {statusMessage ? (
        <ListItemText
          primary={nickname}
          secondary={statusMessage}
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
      <NicknameMenu {...{ anchorEl, open, handleClose }} />
    </ListItem>
  );
}

export default UserSummary;
