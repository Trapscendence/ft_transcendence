import {
  Avatar,
  Badge,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
// import { useState } from 'react';

interface DirectMessageListProps {
  avatar?: string;
  nickname: string;
  ID: number;
  userStatus?: string;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

function DirectMessageList({
  avatar,
  nickname,
  ID,
  // userStatus,
  selectedIndex,
  setSelectedIndex,
}: DirectMessageListProps): JSX.Element {
  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <ListItemButton
      selected={selectedIndex === ID}
      onClick={() => handleListItemClick(ID)}
    >
      <ListItemAvatar>
        <Badge variant="dot" overlap="circular" color="success">
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={nickname} sx={{ textOverflow: 'ellipsis' }} />
    </ListItemButton>
  );
}

export default DirectMessageList;
