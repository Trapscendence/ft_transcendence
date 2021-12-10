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

  const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', uploadFile);

      try {
        await axios({
          method: 'post',
          url: '/upload/profile',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.replace('/setting/');
      } catch (e) {
        console.log(e);
      }
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
                <Button size="small" variant="contained">
                  <form>
                    <label htmlFor="profile-upload" />
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={onChangeImg}
                      hidden
                    />
                  </form>
                  upload
                </Button>
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
