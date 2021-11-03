import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, List } from '@mui/material';

import UserSummary from '../commons/UserSummary';

export default function SocialDrawer(): JSX.Element {
  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          // flexShrink: 0,
          width: '200px',
          '& .MuiDrawer-paper': {
            width: '200px',
            boxSizing: 'border-box',
            bgcolor: 'grey.100',
          },
        }}
      >
        <Box>
          <IconButton>
            <ChevronRight />
          </IconButton>
          <Divider />
          <UserSummary nickname="tmpMy" statusMessage="hello~" />
          <Divider />
          <List>
            <UserSummary nickname="friend1" />
            <UserSummary nickname="friend2" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
            <UserSummary nickname="friend3" />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
