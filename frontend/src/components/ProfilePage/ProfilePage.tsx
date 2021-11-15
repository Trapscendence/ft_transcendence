import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import UseSearchUser from '../../hooks/useSearchUser';
import { UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

export default function ProfilePage(): JSX.Element {
  const avartarStyle = {
    height: '150px',
    width: '150px',
  };
  const paperStyle = {
    height: '200px',
    width: '100%',
  };
  const typoStyle = {
    margin: '10px',
  };

  const avatar = '';
  const nickname = 'seohchoi';
  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });
  const [buttonActive, setButtonActive] = useState(true);

  // const handleOnclick = (value: string) => {
  //   //TODO value를 other_id(selectedIndex)에 넣기
  //   //TODO 위를 위해서 dm 리스트 동적으로 받아오기
  //   return value;
  // };
  return (
    <Box>
      <Stack
        // direction="row"
        // justifyContent="flex-start"
        justifyContent="flex-end"
        spacing={2}
      >
        <Stack
          id="top-var-Stack"
          direction="row"
          spacing={2}
          sx={{ width: '100%', height: '150px' }}
          justifyContent="space-between"
        >
          {avatar ? (
            <Avatar sx={avartarStyle}>{nickname[0].toUpperCase()}</Avatar>
          ) : (
            <Skeleton variant="circular" sx={avartarStyle} />
          )}
          <Stack
            id="info-Text-Stack"
            spacing={2}
            sx={{ width: '400px' }}
            justifyContent="center"
          >
            <Typography variant="body2">랭킹</Typography>
            <Typography variant="h5">닉네임</Typography>
            <Typography variant="body2">월렛 레벨</Typography>
          </Stack>
          <Stack
            id="search-var-Stack"
            spacing={2}
            sx={{ width: '40%' }}
            alignItems="flex-end"
          >
            {data ? (
              <Box
                style={{
                  display: 'flex',
                  width: '400px',
                  // backgroundColor: 'blue',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box style={{ width: '320px' }}>
                  <UseSearchUser {...{ users: data, setButtonActive }} />
                </Box>
                <Button
                  variant="contained"
                  disabled={buttonActive}
                  //NOTE data 목록에 사용자의 input값이 없으면 다음 버튼이 활성화 되지 않아야 함
                  size="medium"
                  sx={{ margin: '5px 0px', width: '10px' }}
                  // onClick={() => handleOnclick(event.target.value)}
                >
                  다음
                </Button>
              </Box>
            ) : (
              <Skeleton variant="rectangular" width={'50'} height={'10'} />
            )}
          </Stack>
        </Stack>

        <Typography variant="h6" style={typoStyle}>
          전적
        </Typography>
        <Paper style={paperStyle}></Paper>
        <Typography variant="h6" style={typoStyle}>
          업적
        </Typography>
        <Paper style={paperStyle}></Paper>
        <Typography variant="h6" style={typoStyle}>
          랭킹
        </Typography>

        <Paper style={paperStyle}></Paper>
      </Stack>
    </Box>
  );
}
