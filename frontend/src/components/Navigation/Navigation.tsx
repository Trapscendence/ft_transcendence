import {
  AccountCircle,
  Analytics,
  Forum,
  Home,
  MoreHoriz,
} from '@mui/icons-material';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import Matching from './Matching';

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

  return (
    <>
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
            <Tab aria-label="/profile/my" icon={<AccountCircle />} />
            <Tab aria-label="/rank" icon={<Analytics />} />
            <Tab aria-label="/channel" icon={<Forum />} />
          </Tabs>
          <Divider />
          <Matching />
        </Box>
        <Tab icon={<MoreHoriz />} />
      </Box>
    </>
  );
}

export default Navigation;
