import {
  AccountCircle,
  Forum,
  Home,
  MoreHoriz,
  VideogameAsset,
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Tab, Tabs } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const onClickPlay = () => {
    setLoading((value) => !value); // loading을 사용하는 toggle... 상태를 어떻게 잘 작성하지?
  };

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

        <Box
          onClick={onClickPlay}
          sx={{ position: 'relative', cursor: 'pointer' }}
        >
          <Tab
            icon={<VideogameAsset />}
            // disabled={loading}
            // color={loading ? 'red' : 'yellow'}
            sx={{ color: loading ? 'text.disabled' : '' }}
          />
          {/* loading에 따라 나타나게... */}
          {/* 참고: https://mui.com/components/progress/#interactive-integration */}
          {loading && (
            <CircularProgress
              color="secondary"
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
