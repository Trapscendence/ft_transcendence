import { Menu, MenuItem, MenuList } from '@mui/material';

import ChannelNicknameMenu from './ChannelNicknameMenu';

interface NicknameMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  channelId?: string;
  id: string;
}

export default function NicknameMenu({
  anchorEl,
  open,
  handleClose,
  channelId,
  id,
}: NicknameMenuProps): JSX.Element {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuList autoFocusItem={open}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>DM</MenuItem>
        <MenuItem>Observe the match</MenuItem>
        <MenuItem>Ask a match</MenuItem>
        <MenuItem>Add to blacklist</MenuItem>
        {channelId && <ChannelNicknameMenu {...{ channelId, id }} />}
      </MenuList>
    </Menu>
  );
}
