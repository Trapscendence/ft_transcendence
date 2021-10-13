import {
  AccountCircle,
  Forum,
  Home,
  MoreHoriz,
  VideogameAsset,
} from '@mui/icons-material';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import React from 'react';

interface NavigationProps {
  tabValue: number;
  handleChange: (e: React.SyntheticEvent, newValue: number) => void;
}

function Navigation({ tabValue, handleChange }: NavigationProps): JSX.Element {
  return (
    <Box
      py={1}
      sx={{
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
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab aria-label="home" icon={<Home />} />
          <Tab aria-label="profile/my" icon={<AccountCircle />} />
          <Tab aria-label="channel" icon={<Forum />} />
        </Tabs>
        <Divider />
        <Tab icon={<VideogameAsset />} />
      </Box>
      <Tab icon={<MoreHoriz />} />
    </Box>
  );
}

export default Navigation;
