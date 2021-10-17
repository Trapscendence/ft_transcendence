import {
  Avatar,
  Badge,
  ClickAwayListener,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import React, { useRef, useState } from 'react';

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
          // ref={anchorRef}
          sx={{ cursor: 'pointer' }}
        />
      ) : (
        <ListItemText
          primary={nickname}
          onClick={handleClick}
          // ref={anchorRef}
          sx={{ cursor: 'pointer' }}
        />
      )}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* <Popper
        // anchorEl={anchorRef.current}
        anchorEl={anchorEl}
        open={open}
        // placement="bottom-start"
        transition
        disablePortal
      >
        <Paper> */}
        {/* <ClickAwayListener onClickAway={handleClose}> */}
        {/* <MenuList autoFocusItem={open} sx={{ py: 0 }}> */}
        <MenuList autoFocusItem={open}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>DM</MenuItem>
          <MenuItem>Observe the match</MenuItem>
          <MenuItem>Ask a match</MenuItem>
        </MenuList>
        {/* </ClickAwayListener> */}
        {/* </Paper> */}
        {/* </Popper> */}
      </Menu>
    </ListItem>
  );
}

export default SocialDrawerItem;
