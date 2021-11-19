import { useQuery } from '@apollo/client';
import { Avatar, Button, Skeleton, Stack } from '@mui/material';
import { useState } from 'react';

import UseSearchUser from '../../hooks/useSearchUser';
import { User, UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

function MyProfile(): JSX.Element {
  const avartarStyle = {
    height: '150px',
    width: '150px',
  };
  const avatar = '';
  const nickname = 'seohchoi';
  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });
  const [buttonActive, setButtonActive] = useState(true);
  //NOTE 이 유저가 그 유저면 그 유저 프로필을 조회하게 하는 훅
  const [inputSpace, setInputSpace] = useState<User>({ nickname: '', id: '' });

  const handleOnclick = (value: User) => {
    //TODO redirect to url/profile/value.nickname
  };

  return (
    <div>
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
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Stack>
          <Stack
            id="search-var-Stack"
            spacing={2}
            sx={{ width: '40%' }}
            alignItems="flex-end"
          >
            {data ? (
              <div
                style={{
                  display: 'flex',
                  width: '400px',
                  // backgroundColor: 'blue',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '320px' }}>
                  <UseSearchUser
                    {...{ users: data, setButtonActive, setInputSpace }}
                  />
                </div>
                <Button
                  variant="contained"
                  disabled={buttonActive}
                  //NOTE data 목록에 사용자의 input값이 없으면 다음 버튼이 활성화 되지 않아야 함
                  size="medium"
                  sx={{ margin: '5px 0px', width: '10px' }}
                  onClick={() => handleOnclick(inputSpace)}
                >
                  다음
                </Button>
              </div>
            ) : (
              <Skeleton variant="rectangular" width={'50'} height={'10'} />
            )}
          </Stack>
        </Stack>

        <Skeleton variant="rectangular" width={'100%'} height={200} />
        <Skeleton variant="rectangular" width={'100%'} height={200} />
        <Skeleton variant="rectangular" width={'100%'} height={200} />
        <Skeleton variant="rectangular" width={'100%'} height={200} />
      </Stack>
    </div>
  );
}

export default MyProfile;
