import { useQuery } from '@apollo/client';
import {
  AccountCircle,
  Analytics,
  Forum,
  Home,
  MoreHoriz,
  SettingsApplicationsSharp,
  VideogameAsset,
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { User, UserData } from '../../utils/Apollo/User';
import { GET_USER } from '../../utils/Apollo/UserQuery';

function Navigation(): JSX.Element {
  interface Itabs {
    [index: string]: number;
    '/home': number;
    '/profile/': number;
    '/rank': number;
    '/channel': number;
  }

  const tabs: Itabs = {
    '/home': 0,
    '/profile/': 1,
    '/rank': 2,
    '/channel': 3,
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    nickname: '',
    id: '',
    avatar: '',
  });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setTabValue(tabs[location.pathname] ?? 0);
  }, []);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    const path: string | null = e.currentTarget.getAttribute('aria-label');
    history.push(path as string);
    setTabValue(newValue);
  };

  //TODO useQuery로 내 id 가져오기
  const { data: currentUserData } = useQuery<UserData>(GET_USER);

  useEffect(() => {
    if (currentUserData?.user?.id) setCurrentUser(currentUserData?.user);
  }, [currentUserData]);

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
      history.push('/');
    });
  };

  const onClickPlay = () => {
    setLoading((value) => !value); // NOTE: loading을 사용하는 toggle... 더 나은 상태 작성법이 있나?
  };
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    console.log(open);
  };
  return (
    <Box>
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
          <Tabs
            value={tabValue}
            onChange={handleChange}
            orientation="vertical"
            // textColor="secondary"
            // indicatorColor="secondary"
          >
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
          <Box
            onClick={onClickPlay}
            sx={{ position: 'relative', cursor: 'pointer' }}
          >
            <Tab
              icon={<VideogameAsset />}
              // disabled={loading}
              sx={{ color: loading ? 'text.disabled' : '' }}
            />
            {loading && (
              <CircularProgress
                // color="secondary"
                size={35}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-17px',
                  marginLeft: '-17px',
                  zIndex: 1,
                }}
              />
            )}
          </Box>
        </Box>
        <Stack>
          <Tabs
            // onChange={handleChange}
            orientation="vertical"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              aria-label="auth/logout"
              icon={<LogoutIcon />}
              onClick={logOut}
            />
            <Tab icon={<MoreHoriz />} onClick={toggleDrawer(true)} />
          </Tabs>
        </Stack>

        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Stack
            sx={{
              height: '100vh',
              backgroundColor: '#F0F0F0',
            }}
            direction="column"
            justifyContent="space-between"
          >
            <List>
              {['공지사항', '패치노트', '게임규칙', '멋진그림', '크레딧'].map(
                (text, index) => (
                  <ListItem button={false} key={index}>
                    <Button
                      color="secondary"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#708090',
                        width: '170px',
                        padding: '5px',
                        margin: '1px',
                      }}
                    >
                      <ListItemText primary={text} />
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
                    color="secondary"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#708090',
                      width: '170px',
                      padding: '5px',
                      margin: '1px',
                    }}
                  >
                    <ListItemText primary={text} />
                  </Button>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navigation;
