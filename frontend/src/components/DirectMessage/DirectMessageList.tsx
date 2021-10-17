import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText} from '@mui/material';
import { useState } from 'react';


interface DirectMessageListProps {
    avatar?: string;
    nickname: string;
    lastMessageDate: number;
    userStatus?: string;
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  }
  
function DirectMessageList({
    avatar,
    nickname,
    lastMessageDate,
    userStatus,
    selectedIndex,
    setSelectedIndex
  }: DirectMessageListProps): JSX.Element {

    const handleListItemClick = (
      index: number,
    ) => {
      setSelectedIndex(index);
    };

  return (
    <ListItem selected={selectedIndex === lastMessageDate} onClick={() => handleListItemClick(lastMessageDate)}>
      <ListItemAvatar>
          <Badge variant="dot" overlap="circular" color="secondary">
          {avatar ? (
            <Avatar src={avatar} />
          ) : (
            <Avatar>{nickname[0].toUpperCase()}</Avatar>
          )}
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={nickname} sx={{textOverflow: 'ellipsis',}}/>
    </ListItem>
  );
      }

export default DirectMessageList;
