import { useQuery } from '@apollo/client';
import {
  AccountCircle,
  Analytics,
  Forum,
  Home,
  MoreHoriz,
  SettingsApplicationsSharp,
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { userIdVar } from '../..';
import { User, UserData } from '../../utils/Apollo/User';
import { GET_USER } from '../../utils/Apollo/UserQuery';
import Matching from './Matching';

interface Itabs {
  [index: string]: number;
  '/home': number;
  '/profile/': number;
  '/rank': number;
  '/channel': number;
  '/setting': number;
}

const tabs: Itabs = {
  '/home': 0,
  '/profile/': 1,
  '/rank': 2,
  '/channel': 3,
  '/setting': 4,
}; // NOTE: 새로고침시 현재 주소에 따라 탭 선택을 활성화하기위해 사용

function Navigation(): JSX.Element {
  const history = useHistory();

  const location = useLocation();

  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState<User>({
    nickname: '',
    id: '',
    avatar: '',
  });
  const [open, setOpen] = React.useState(false);

  //TODO useQuery로 내 id 가져오기
  const { data: currentUserData } = useQuery<UserData>(GET_USER);

  useEffect(() => {
    setTabValue(tabs[location.pathname] ?? 0);
  }, []);

  useEffect(() => {
    if (currentUserData?.user?.id) setCurrentUser(currentUserData?.user);
  }, [currentUserData]);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    const path: string | null = e.currentTarget.getAttribute('aria-label');
    history.push(path as string);
    setTabValue(newValue);
  };

  const logOut = () => {
    return new Promise(() => {
      const endpoint = `http://${process.env.REACT_APP_SERVER_HOST ?? ''}:${
        process.env.REACT_APP_SERVER_PORT ?? ''
      }/api/auth/logout`;
      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).catch((e) => console.log('error::', e));
      //then 강제 새로고침 할것
      userIdVar('');
      history.push('/');
    });
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    console.log(open);
  };

  function adminOnclick(text: string) {
    history.push('/admin/' + text);
  }

  return (
    <Box
      py={1}
      sx={{
        position: 'fixed',
        zIndex: 1,
        bgcolor: 'white',
        // width: '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      <Box>
        <Tabs value={tabValue} onChange={handleChange} orientation="vertical">
          <Tab aria-label="/home" icon={<Home />} />
          <Tab
            aria-label={'/profile/' + currentUser.id}
            icon={<AccountCircle />}
          />
          <Tab aria-label="/rank" icon={<Analytics />} />
          <Tab aria-label="/channel" icon={<Forum />} />
          <Tab aria-label="/setting" icon={<SettingsApplicationsSharp />} />
        </Tabs>
        <Divider />
        <Box>
          <Matching />
        </Box>
      </Box>
      <Stack>
        <Tab icon={<MoreHoriz />} onClick={toggleDrawer(true)} />
        <Tab aria-label="auth/logout" icon={<LogoutIcon />} onClick={logOut} />
      </Stack>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Stack
          sx={{ height: '100vh' }}
          direction="column"
          justifyContent="space-between"
        >
          <List>
            {['Notice', 'PatchNote', 'Rule', 'AmazingPicture'].map(
              (text, index) => (
                <ListItem button={false} key={index}>
                  <Button
                    variant="contained"
                    sx={{ width: '170px' }}
                    onClick={() => adminOnclick(text)}
                  >
                    {text}
                    {/* // NOTE: ListItemText와 그냥 text를 넣는 것의 차이가 디자인말고 있을까? 디자인은 취향 차이인듯. */}
                  </Button>
                </ListItem>
              )
            )}
          </List>
          <Box />
          <List>
            {['유저목록', '게임목록', '채널목록'].map((text, index) => (
              <ListItem key={index}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: '170px' }}
                >
                  {text}
                </Button>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Drawer>
    </Box>
  );
}

export default Navigation;
