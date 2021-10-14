import { ChevronRight, PermContactCalendar } from '@mui/icons-material';
import { Box, Divider, Drawer, Fab, IconButton, List } from '@mui/material';

import SocialDrawerItem from '../common/SocialDrawerItem';

interface SocialDrawerProps {
  open: boolean;
  toggleDrawer: (openBool: boolean) => () => void;
}

export default function SocialDrawer({
  open,
  toggleDrawer,
}: SocialDrawerProps): JSX.Element {
  return (
    <Box>
      <Fab onClick={toggleDrawer(true)} size="medium" sx={{ margin: '20px' }}>
        <PermContactCalendar />
      </Fab>
      <Drawer variant="persistent" anchor="right" open={open}>
        <Box
          sx={{
            minWidth: '200px',
            bgcolor: 'grey.200',
            height: '100vh',
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronRight />
          </IconButton>
          <Divider />
          {/* 내 정보 */}
          <SocialDrawerItem nickname="tmpMy" statusMessage="hello~" />
          <Divider />
          {/* 친구 정보 */}
          <List>
            <SocialDrawerItem nickname="friend1" />
            <SocialDrawerItem nickname="friend2" />
            <SocialDrawerItem nickname="friend3" />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
