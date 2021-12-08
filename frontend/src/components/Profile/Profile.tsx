import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Card,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import UseSearchUser from '../../hooks/useSearchUser';
import {
  MatchData,
  MatchDataVars,
  User,
  UserProfile,
  UserProfileData,
  UsersDataVars,
} from '../../utils/Apollo/User';
import {
  GET_MATCH_WITH_ACHIEVE_BY_NICKNAME,
  GET_USERS,
} from '../../utils/Apollo/UserQuery';

function Profile(): JSX.Element {
  const avartarStyle = {
    height: '150px',
    width: '150px',
  };
  const paperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignsItem: 'center',
    minHeight: '170px',
    padding: '5%',
    // width: '80%',
  };
  const typoStyle = {
    margin: '10px',
  };

  const { error, data } = useQuery<UserProfileData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });
  const [inputSpace, setInputSpace] = useState<User>({
    nickname: '',
    id: '',
    avatar: '',
  });
  const [buttonActive, setButtonActive] = useState(true);
  const history = useHistory();
  const handleOnclick = (value: User) => {
    console.log(value.nickname);
    console.log(history);
    history.push('/profile/' + value.id);
  };
  //NOTE 이 유저가 그 유저면 그 유저 프로필을 조회하게 하는 훅

  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>({
    nickname: '',
    id: '',
    rank: 0,
    avatar: '',
  });

  const location = useLocation();
  const urlInputId: number = parseInt(
    location.pathname.substring(
      location.pathname.lastIndexOf('/') + 1,
      location.pathname.length
    )
  );
  useEffect(() => {
    if (data?.users[urlInputId - 1]) setCurrentUser(data.users[urlInputId - 1]);
    else setCurrentUser(undefined);
  }, [urlInputId, data]);

  //---------------------------------------matchHistory and achieve
  const { data: profileData } = useQuery<MatchData, MatchDataVars>(
    GET_MATCH_WITH_ACHIEVE_BY_NICKNAME,
    {
      variables: {
        nickname: currentUser?.nickname ?? '',
        offset: 0,
        limit: 5,
      },
    }
  );
  //---------------------------------------------------

  if (currentUser == undefined) return <div>404 TRap caRd!!</div>;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        id="top-var-Stack"
        direction="row"
        spacing={2}
        justifyContent="space-between"
      >
        {currentUser?.avatar ? (
          <Avatar
            sx={avartarStyle}
            src={'/storage/' + currentUser?.avatar}
          ></Avatar>
        ) : (
          <Avatar sx={avartarStyle}>
            {currentUser?.nickname[0]?.toUpperCase()}
          </Avatar>
          // <Skeleton variant="circular" sx={avartarStyle} />
        )}
        <Stack id="info-Text-Stack" spacing={2} justifyContent="center">
          <Typography variant="body2">랭킹</Typography>
          <Typography variant="h5">
            {currentUser && currentUser.nickname}
          </Typography>
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
            </Box>
          ) : (
            <Skeleton variant="rectangular" width={'50'} height={'10'} />
          )}
        </Stack>
      </Stack>

      <Box sx={{ width: '60%' }}>
        <Typography variant="h6" style={typoStyle}>
          전적
        </Typography>
        <Paper style={paperStyle} variant="outlined">
          {profileData?.user?.match_history?.map((match) => (
            <Stack>
              <Typography>
                승자 : {match.winner.nickname} 패자 : {match.loser.nickname}
              </Typography>
              <Typography>
                {/* {match.winner_points} : {match.loser_points} */}
              </Typography>
            </Stack>
          ))}
        </Paper>
        <Typography variant="h6" style={typoStyle}>
          달성한 업적
        </Typography>
        <Paper style={paperStyle} variant="outlined">
          <Box>
            {profileData?.user?.achievements.map((achieve) => (
              <Box
                component="span"
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  border: '1px dashed grey',
                }}
              >
                - {achieve.name}
              </Box>
            ))}
          </Box>
        </Paper>
        <Typography variant="h6" style={typoStyle}>
          랭킹
        </Typography>

        <Paper style={paperStyle} variant="outlined">
          <Box
            component="span"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              border: '1px dashed grey',
            }}
          >
            {currentUser.rank}위
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Profile;
