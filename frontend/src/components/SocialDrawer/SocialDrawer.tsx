import { ChevronRight, PermContactCalendar } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface SocialDrawerProps {
  open: boolean;
  toggleDrawer: (openBool: boolean) => () => void;
}

// 모양 임시!
// List 등은 데이터 연결해야함
// ListItem 클릭시 행동도 정의해야

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
        <Box sx={{ width: '150px' }}>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronRight />
          </IconButton>
          <Divider />
          <List>
            <ListItem>
              <ListItemText primary="친구" />
            </ListItem>
            <ListItem>
              <ListItemText primary="친구" />
            </ListItem>
            <ListItem>
              <ListItemText primary="친구" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
