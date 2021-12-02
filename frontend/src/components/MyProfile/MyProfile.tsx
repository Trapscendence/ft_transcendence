/* eslint-disable */

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
import axios from 'axios';
import {
  CHANGE_NICKNAME,
  CREATE_TFA,
  DELETE_TFA,
  GET_USER,
  GET_USER_BY_NICKNAME,
  GET_USERS,
} from '../../utils/Apollo/UserQuery';

export default function MyProfileSetting(): JSX.Element {
  const avartarStyle = {
    height: '95px',
    width: '95px',
  };
  const elementStyle = {
    // height: '150px',
    minHeight: '150px',

    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  const buttonStyle = {
    // boxShadow: 0,
    margin: '5px',
    height: '30px',
  };
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
    console.log(tfaUri);
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
  // const PictureHandler = () => {

  //   axios
  //     .post(endpoint, 'file')
  //     .then((response) => this.setState({ articleId: response.data.id }));
  // };
  const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', uploadFile);
      //   const endpoint = `http://${process.env.REACT_APP_SERVER_HOST ?? ''}:${
      //     process.env.REACT_APP_SERVER_PORT ?? ''
      //   }/upload/profile`;
      await axios({
        method: 'post',
        url: '/upload/profile',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(() => window.location.replace('/setting/'));
    }
  };
  //----------------------------------------------------picture
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
          rowSpacing={4}
          columnSpacing={{ md: 1 }}
        >
          <Grid item xs={6}>
            <Paper sx={elementStyle}>
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
                    <Button
                      sx={buttonStyle}
                      variant="contained"
                      component="span"
                    >
                      Upload
                    </Button>
                  </label>
                </form>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper sx={elementStyle}>
              <Stack>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setErrorMessage('');
                    if (nicknameinputSpace == '')
                      setErrorMessage('빈 닉네임을 할 수 없습니다.');
                    else if (nicknameUserData?.user != undefined)
                      setErrorMessage('이미 존재하는 닉네임입니다.');
                    else {
                      console.log(nicknameinputSpace);

                      changeNickname({
                        variables: { new_nickname: nicknameinputSpace },
                      }).catch(() => setErrorMessage('변경 실패!'));
                      console.log(changeNicknameError);

                      window.location.replace('/setting/');
                    }
                  }}
                >
                  {/* TODO USESEARCHUSER 써서 닉네임 중복 안되게 해야합니당 */}
                  <Box>
                    <Typography>
                      {currentUser?.nickname}님, 안녕하세요!
                    </Typography>
                  </Box>

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
            <Paper sx={elementStyle}>
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
            <Paper sx={elementStyle}>
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
                  블랙리스트 목록
                  <Divider />
                  {blacklistData?.user?.blacklist?.map((blackUser) => (
                    <Box sx={{ width: '100%' }}>
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
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={elementStyle}>
              <Typography variant="body2">회원탈퇴</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
