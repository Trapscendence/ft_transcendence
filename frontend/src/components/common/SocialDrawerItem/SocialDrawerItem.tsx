import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

interface SocialDrawerItemProps {
  avatar?: string;
  nickname: string;
  statusMessage?: string;
}

function SocialDrawerItem({
  avatar,
  nickname,
  statusMessage,
}: SocialDrawerItemProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 상태에 따라 다르게 나타나야 하는데... 어떻게 해야? 뱃지랑 메뉴가 달라야함
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
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>DM</MenuItem>
        <MenuItem>Observe the match</MenuItem>
        <MenuItem>Ask a match</MenuItem>
      </Menu>
    </ListItem>
  );
}

export default SocialDrawerItem;
