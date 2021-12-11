/* eslint-disable */

import { useMutation, useQuery } from '@apollo/client';
import { CardActions } from '@material-ui/core';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
} from '@mui/material';
import axios from 'axios';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useInput } from '../../hooks/useInput';
import { User, UserData } from '../../utils/Apollo/User';
import { CHANGE_NICKNAME, GET_USER } from '../../utils/Apollo/UserQuery';
import ErrorAlert from '../commons/ErrorAlert';

const avartarStyle = {
  height: '45px',
  width: '45px',
};

export default function Register(): JSX.Element {
  /*
   ** ANCHOR: Hooks
   */

  const [currentUser, setCurrentUser] = useState<User | undefined>({
    nickname: '',
    id: '',
    avatar: '',
  });
  const [nickname, , onChangeNickname] = useInput('');
  const [nicknameError, setNicknameError] = useState(false);
  const history = useHistory();

  /*
   ** ANCHOR: Apollo
   */

  const { data: currentUserData } = useQuery<UserData>(GET_USER);

  const [changeNickname, { error: changeNicknameError }] =
    useMutation<{ changeNickname: boolean }>(CHANGE_NICKNAME);

  useEffect(() => {
    if (currentUserData?.user) setCurrentUser(currentUserData?.user);
  }, [currentUserData]);

  /*
   ** ANCHOR: functions
   */
  const [updateAvatar] = useMutation(
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
        .then(() => window.location.replace('/register'))
        .catch(() => console.log('변경 실패!'));
    }
  };

  const onClickSubmit = () => {
    if (!nickname.length) {
      setNicknameError(true);
      return;
    }

    void changeNickname({ variables: { new_nickname: nickname } });
    history.push('/home');
  };

  /*
   ** ANCHOR: render
   */

  return (
    <>
      {changeNicknameError && (
        <ErrorAlert name="Register" error={changeNicknameError} />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <Card sx={{ m: 1, width: '350px', bgcolor: 'grey.100' }}>
          <CardHeader
            title="Hello, new user!"
            subheader="Set your nickname and profile picture"
          />
          <CardContent>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <TextField
                label="nickname"
                variant="filled"
                size="small"
                sx={{ width: '100%' }}
                margin="dense"
                error={nicknameError}
                helperText={nicknameError ? 'Nickname must be entered.' : null}
                value={nickname}
                onChange={onChangeNickname}
              />
              <Box
                sx={{
                  my: 1,
                  width: '100%',
                  display: 'inlineFlex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {currentUser?.avatar ? (
                  <Avatar
                    sx={avartarStyle}
                    src={'/storage/' + currentUser?.avatar}
                  />
                ) : (
                  <Avatar sx={avartarStyle}>
                    {currentUser?.nickname[0]?.toUpperCase()}
                  </Avatar>
                )}
                <form>
                  <label htmlFor="profile-upload">
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={onChangeImg}
                      style={{ display: 'none' }}
                    />
                    <Button variant="contained" component="span">
                      아바타 변경
                    </Button>
                  </label>
                </form>
              </Box>
            </Paper>
          </CardContent>
          <CardActions>
            <Button size="large" onClick={onClickSubmit}>
              set profile
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}
