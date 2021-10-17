import { ChevronRight, PermContactCalendar } from '@mui/icons-material';
import { Box, Divider, Drawer, Fab, IconButton, List } from '@mui/material';
import { useState } from 'react';

import SocialDrawerItem from '../common/SocialDrawerItem';

export default function SocialDrawer(): JSX.Element {
  // const [open, setOpen] = useState(false);
  // const toggleDrawer = (openBool: boolean) => () => {
  //   setOpen(openBool);
  // };

  return (
    <Box>
      {/* <Fab onClick={toggleDrawer(true)} size="medium" sx={{ margin: '20px' }}>
        <PermContactCalendar />
      </Fab> */}
      {/* <Drawer variant="persistent" anchor="right" open={open}> */}
      <Drawer variant="permanent" anchor="right">
        <Box
          sx={{
            minWidth: '200px',
            bgcolor: 'grey.200',
            height: '100vh',
          }}
        >
          {/* 닫기 버튼 */}
          {/* <IconButton onClick={toggleDrawer(false)}> */}
          <IconButton>
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
