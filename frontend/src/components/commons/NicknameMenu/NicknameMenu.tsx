import { Menu, MenuItem, MenuList } from '@mui/material';

interface NicknameMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export default function NicknameMenu({
  anchorEl,
  open,
  handleClose,
}: NicknameMenuProps): JSX.Element {
  // NOTE
  // 이게 common 컴포넌트가 맞을까?
  // 참가자 닉네임 클릭시는 친구창 닉네임 클릭시랑 다른 메뉴가 뜰텐데...
  // 그냥 따로 구현하는게 편할까?

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuList autoFocusItem={open}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>DM</MenuItem>
        <MenuItem>Observe the match</MenuItem>
        <MenuItem>Ask a match</MenuItem>
      </MenuList>
    </Menu>
  );
}
