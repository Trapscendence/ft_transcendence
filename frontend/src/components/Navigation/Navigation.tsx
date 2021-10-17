import {
  AccountCircle,
  Forum,
  Home,
  MoreHoriz,
  VideogameAsset,
} from '@mui/icons-material';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

function Navigation(): JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const history = useHistory();
  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    const path: string | null = e.currentTarget.getAttribute('aria-label');
    history.push('/' + (path as string));
    setTabValue(newValue);
  }; // @mui/lab 에서 제공하는 페이지 이동 api가 있음. 어느게 성능이 더 좋을지 모르겠다. https://mui.com/components/tabs/#experimental-api 참고

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
