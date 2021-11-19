import {
  AccountCircle,
  Analytics,
  Forum,
  Home,
  MoreHoriz,
  VideogameAsset,
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

function Navigation(): JSX.Element {
  interface Itabs {
    [index: string]: number;
    '/home': number;
    '/profile/my': number;
    '/rank': number;
    '/channel': number;
  }

  const tabs: Itabs = {
    '/home': 0,
    '/profile/my': 1,
    '/rank': 2,
    '/channel': 3,
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const onClickPlay = () => {
    setLoading((value) => !value); // NOTE: loading을 사용하는 toggle... 더 나은 상태 작성법이 있나?
  };

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
        <Tabs
          value={tabValue}
          onChange={handleChange}
          orientation="vertical"
          // textColor="secondary"
          // indicatorColor="secondary"
        >
          <Tab aria-label="/home" icon={<Home />} />
          <Tab aria-label="/profile/my" icon={<AccountCircle />} />
          <Tab aria-label="/rank" icon={<Analytics />} />
          <Tab aria-label="/channel" icon={<Forum />} />
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
      <Tab icon={<MoreHoriz />} />
    </Box>
  );
}

export default Navigation;
