import { useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import UseSearchUser from '../../hooks/useSearchUser';
import {
  User,
  UserData,
  UsersData,
  UsersDataVars,
} from '../../utils/Apollo/User';
import {
  GET_USER,
  GET_USER_BY_NICKNAME,
  GET_USERS,
} from '../../utils/Apollo/UserQuery';
import {
  ADD_TO_BLACKLIST,
  DELETE_FROM_BLACKLIST,
  GET_MY_BLACKLIST,
} from '../../utils/gqls';
import {
  AddToBlackListResponse,
  DeleteFromBlackListResponse,
  GetMyBlacklistResponse,
} from '../../utils/responseModels';

export default function MyProfileSetting(): JSX.Element {
  const avartarStyle = {
    height: '95px',
    width: '95px',
  };
  const typoStyle = {
    margin: '10px',
  };
  const elementStyle = {
    height: '150px',

    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  const { data: currentUserData } = useQuery<UserData>(GET_USER);
  const [currentUser, setCurrentUser] = useState<User | undefined>({
    nickname: '',
    id: '',
  });
  useEffect(() => {
    if (currentUserData?.user.id) setCurrentUser(currentUserData?.user);
  }, [currentUserData]);

  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST, {
      variables: { id: currentUserData?.user.id },
    });

  //----------------------------------------------------------닉네임
  // const [nicknameButtonActive, setNicknameButtonActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [nicknameinputSpace, setNicknameInputSpace] = useState<string>('');
  const { data: nicknameUserData } = useQuery<UserData>(GET_USER_BY_NICKNAME, {
    variables: { nickname: nicknameinputSpace },
  });
  const onchangeNickname = (e: React.FormEvent<HTMLInputElement>) =>
    setNicknameInputSpace(e.currentTarget.value);
  // useEffect(() => {
  //   if (nicknameUserData?.user != undefined) setNicknameButtonActive(true);
  //   else setNicknameButtonActive(false);
  // }, [nicknameinputSpace]);

  const handleChangeNickname = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setErrorMessage('');
    if (nicknameUserData?.user != undefined)
      setErrorMessage('이미 존재하는 닉네임입니다.');
    if (nicknameinputSpace == '')
      setErrorMessage('빈 닉네임을 할 수 없습니다.');
  };
  //----------------------------------------------------------닉네임

  const [buttonActive, setButtonActive] = useState(true);
  const [inputSpace, setInputSpace] = useState<User>({ nickname: '', id: '' });

  const [addToBlackList, { error: AddError }] =
    useMutation<AddToBlackListResponse>(ADD_TO_BLACKLIST, {
      variables: { black_id: inputSpace.id },
      refetchQueries: [GET_MY_BLACKLIST],
    });
  const [blackUserId, setBlackUserId] = useState({ id: '' });

  const [deleteFromBlackList, { error: deleteError }] =
    useMutation<DeleteFromBlackListResponse>(DELETE_FROM_BLACKLIST, {
      variables: { black_id: blackUserId.id },
      refetchQueries: [GET_MY_BLACKLIST],
    });

  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: '70%',
          width: '90%',
          padding: '5% 15%',
          margin: '5%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'space-between',
        }}
      >
        <Grid
          container
          // direction="column"
          rowSpacing={4}
          columnSpacing={{ md: 1 }}
        >
          <Grid item xs={6}>
            <Paper sx={elementStyle} variant="outlined">
              <Stack spacing={1} alignItems="center">
                <Avatar sx={avartarStyle}>
                  {currentUser?.nickname[0]?.toUpperCase()}
                </Avatar>
                <Box />
                <button> 프로필 사진 변경</button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper sx={elementStyle} variant="outlined">
              <Stack>
                <form>
                  {/* TODO USESEARCHUSER 써서 닉네임 중복 안되게 해야합니당 */}
                  <input
                    onChange={onchangeNickname}
                    // defaultValue={currentUser?.nickname}
                  ></input>
                  <button
                    // disabled={nicknameButtonActive}
                    onClick={handleChangeNickname}
                  >
                    닉네임 변경
                  </button>
                </form>
                {errorMessage ? errorMessage : ''}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Typography variant="body2">
                2차 인증 <br /> - 구글 인증 : <br /> 사용중 or 활성화하기
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Stack>
                블랙리스트 목록
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
                      onClick={() => addToBlackList()}
                    >
                      다음
                    </Button>
                  </Box>
                ) : (
                  <Box />
                )}
                <Box>
                  {blacklistData?.user.blacklist.map(
                    (blackUser) => (
                      setBlackUserId(blackUserId),
                      (
                        <Box>
                          <Typography>blackUser.id</Typography>
                          <button onClick={() => deleteFromBlackList()}>
                            X
                          </button>
                        </Box>
                      )
                    )
                  )}
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Typography variant="body2">회원탈퇴</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
