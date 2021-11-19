import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, List } from '@mui/material';

import { UserStatus } from '../../utils/Apollo/schemaEnums';
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
          <UserSummary
            IUser={{
              id: '1',
              nickname: 'tmpMy',
              avatar: 'dd',
              status: UserStatus.ONLINE,
            }}
          />
          <Divider />
          <List>
            <UserSummary
              IUser={{
                id: '2',
                nickname: 'kim',
                avatar: 'dd',
                status: UserStatus.ONLINE,
              }}
            />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
