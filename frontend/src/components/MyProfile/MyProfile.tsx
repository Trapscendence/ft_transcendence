/* eslint-disable */
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import qrcode from 'qrcode';
import { useEffect, useState } from 'react';

import UseSearchUser from '../../hooks/useSearchUser';
import {
  ADD_TO_BLACKLIST,
  DELETE_FROM_BLACKLIST,
  GET_MY_BLACKLIST,
} from '../../utils/Apollo/gqls';
import {
  AddToBlackListResponse,
  DeleteFromBlackListResponse,
  GetMyBlacklistResponse,
} from '../../utils/Apollo/responseModels';
import {
  CurrentUsersData,
  User,
  UserData,
  UsersData,
  UsersDataVars,
} from '../../utils/Apollo/User';
import {
  CHANGE_NICKNAME,
  CREATE_TFA,
  DELETE_TFA,
  GET_USER,
  GET_USER_BY_NICKNAME,
  GET_USERS,
} from '../../utils/Apollo/UserQuery';

const avartarStyle = {
  height: '95px',
  width: '95px',
};
const elementStyle = {
  // height: '150px',
  minHeight: '170px',

  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const buttonStyle = {
  // boxShadow: 0,
  margin: '5px',
  height: '30px',
};

export default function MyProfileSetting(): JSX.Element {
  const { data: currentUserData } = useQuery<UserData>(GET_USER);
  const [currentUser, setCurrentUser] = useState<User | undefined>({
    nickname: '',
    id: '',
    avatar: '',
  });
  useEffect(() => {
    if (currentUserData?.user) setCurrentUser(currentUserData?.user);
  }, [currentUserData]);

  const { data: blacklistData, error: blacklistError } =
    useQuery<GetMyBlacklistResponse>(GET_MY_BLACKLIST, {
      // variables: { id: currentUserData?.user.id },
    });

  //ANCHOR----------------------------------------------------------닉네임
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

  const [changeNickname, { data: changeNicknameError }] =
    useMutation<{ changeNickname: boolean }>(CHANGE_NICKNAME);

  //----------------------------------------------------------닉네임

  const [buttonActive, setButtonActive] = useState(true);
  const [inputSpace, setInputSpace] = useState<User>({
    nickname: '',
    id: '',
    avatar: '',
  });

  const [addToBlackList, { error: AddError }] =
    useMutation<AddToBlackListResponse>(ADD_TO_BLACKLIST, {
      variables: { black_id: inputSpace.id },
      refetchQueries: [GET_MY_BLACKLIST],
    });

  const [deleteFromBlackList, { error: deleteError }] =
    useMutation<DeleteFromBlackListResponse>(DELETE_FROM_BLACKLIST, {
      refetchQueries: [GET_MY_BLACKLIST],
    });

  //------------------------------------------------------------블랙리스트

  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });

  const [createTfa, { data: tfaUri, error: TfaError }] =
    useMutation<{ createTfa: string }>(CREATE_TFA);
  const [imageUrl, setImageUrl] = useState<string>();
  const [deleteTfa] = useMutation(DELETE_TFA);

  useEffect(() => {
    // console.log(tfaUri);
    if (tfaUri?.createTfa != undefined) {
      qrcode.toDataURL(tfaUri.createTfa, (err, img) => {
        if (err) {
          console.log('Error with QR');
          return;
        }
        setImageUrl(img);
      });
    }
  }, [tfaUri]);

  //-----------------------------------------------tfa

  function ChangeMyPicture() {
    // const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   e.preventDefault();

    //   if (e.target.files) {
    //     const uploadFile = e.target.files[0];
    //     const formData = new FormData();
    //     formData.append('file', uploadFile);
    //     //   const endpoint = `http://${process.env.REACT_APP_SERVER_HOST ?? ''}:${
    //     //     process.env.REACT_APP_SERVER_PORT ?? ''
    //     //   }/upload/profile`;
    //     await axios({
    //       method: 'post',
    //       url: '/upload/profile',
    //       data: formData,
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }).then(() => window.location.replace('/setting/'));
    //   }

    const [updateAvatar, { error }] = useMutation(
      gql`
        mutation updateAvatar($file: Upload!) {
          updateAvatar(file: $file)
        }
      `
    );

    const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (e.target.files) {
        const file = e.target.files[0];
        updateAvatar({ variables: { file } })
          .then(() => window.location.replace('/setting'))
          .catch(() => console.log('변경 실패!'));
      }
    };

    return (
      <Grid item xs={12}>
        <Paper sx={elementStyle} variant="outlined">
          <Stack spacing={1} alignItems="center">
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
            <Box />
            {/* <button> 프로필 사진 변경</button> */}
            <form>
              <label htmlFor="profile-upload">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={onChangeImg}
                  style={{ display: 'none' }}
                />
                <Button sx={buttonStyle} variant="contained" component="span">
                  아바타 변경
                </Button>
              </label>
            </form>
          </Stack>
        </Paper>
      </Grid>
    );
  }

  const [value, setValue] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  //----------------------------------------------------picture

  const [unregister] = useMutation(
    gql`
      mutation unregister {
        unregister
      }
    `
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          height: '70%',
          width: '90%',
          padding: '0% 15%',
          margin: '0%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'space-between',
        }}
      >
        <Grid
          container
          // direction="column"
          rowSpacing={5}
          columnSpacing={{ md: 1 }}
        >
          <Grid item xs={12}>
            <Box sx={elementStyle}>
              <Typography variant="h3">
                {currentUser?.nickname}님의
                <br />
                설정입니다.
              </Typography>
            </Box>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="아바타 변경" />
              <Tab label="닉네임 변경" />
              <Tab label="2차 인증" />
              <Tab label="블랙리스트 관리" />
              <Tab label="회원 탈퇴" />
            </Tabs>
          </Grid>

          <ChangeMyPicture />

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Stack spacing={1} alignItems="center">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setErrorMessage('');
                    if (nicknameinputSpace == '')
                      setErrorMessage('빈 닉네임을 할 수 없습니다.');
                    else if (nicknameUserData?.user != undefined)
                      setErrorMessage('이미 존재하는 닉네임입니다.');
                    else {
                      changeNickname({
                        variables: { new_nickname: nicknameinputSpace },
                      }).catch(() => setErrorMessage('변경 실패!'));
                      console.log(changeNicknameError);

                      window.location.replace('/setting/');
                    }
                  }}
                >
                  <input
                    onChange={onchangeNickname}
                    // defaultValue={currentUser?.nickname}
                  ></input>
                  <Button
                    variant="contained"
                    type="submit"
                    // disabled={nicknameButtonActive}
                    // onClick={handleChangeNickname}
                    sx={buttonStyle}
                  >
                    닉네임 변경
                  </Button>
                </form>
                {errorMessage ? errorMessage : ''}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Typography variant="body2">
                2차 인증 <br />
                {imageUrl && imageUrl != '' ? (
                  <Stack>
                    <Button
                      sx={buttonStyle}
                      variant="contained"
                      onClick={() => {
                        deleteTfa();
                        setImageUrl('');
                      }}
                    >
                      비활성화하기
                    </Button>
                    <img src={imageUrl} />
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    sx={buttonStyle}
                    onClick={() => createTfa()}
                  >
                    활성화하기
                  </Button>
                )}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Stack>
                블랙리스트 추가
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
                  {blacklistData?.user ? (
                    <Box />
                  ) : (
                    <Box>
                      블랙리스트 목록 <Divider />
                      {blacklistData?.user?.blacklist?.map((blackUser) => (
                        <Box key={blackUser.id} sx={{ width: '100%' }}>
                          <Typography sx={{ width: '80%' }}>
                            {blackUser.nickname}
                            <Button
                              variant="contained"
                              sx={{
                                // boxShadow: 0,
                                margin: '5px',
                                height: '20px',
                                width: '20px',
                              }}
                              onClick={() =>
                                deleteFromBlackList({
                                  variables: { black_id: blackUser.id },
                                })
                              }
                            >
                              X
                            </Button>
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle} variant="outlined">
              <Button variant="contained" onClick={() => unregister()}>
                회원탈퇴
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
