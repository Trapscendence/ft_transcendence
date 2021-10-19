import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, List } from '@mui/material';

import UserSummary from '../common/UserSummary';

export default function SocialDrawer(): JSX.Element {
  // const [open, setOpen] = useState(false);
  // const toggleDrawer = (openBool: boolean) => () => {
  //   setOpen(openBool);
  // };

  // 충분히 분리가 가능... 하지만 일단은 놔둔다.
  // 실제 데이터가 확정됐을 때! 컴포넌트를 어떤 식으로 나눌지, 상태는 어디에 주입할지 생각해보자.

  return (
    <Box>
      {/* <Fab onClick={toggleDrawer(true)} size="medium" sx={{ margin: '20px' }}>
        <PermContactCalendar />
      </Fab> */}
      {/* <Drawer variant="persistent" anchor="right" open={open}> */}
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
          {/* 닫기 버튼 */}
          {/* <IconButton onClick={toggleDrawer(false)}> */}
          <IconButton>
            <ChevronRight />
          </IconButton>
          <Divider />
          {/* 내 정보 */}
          <UserSummary nickname="tmpMy" statusMessage="hello~" />
          <Divider />
          {/* 친구 정보 */}
          <List>
            <UserSummary nickname="friend1" />
            <UserSummary nickname="friend2" />
            <UserSummary nickname="friend3" />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
