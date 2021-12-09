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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import gql from 'graphql-tag';

function AmazingPicture(): JSX.Element {
  //TODO 권한 없을경우 권한이 없습니다. 띄우게하기
  const [setAmazingPicture, { error }] = useMutation<{
    amazing_picture: string;
  }>(
    gql`
      mutation setAmazingPicture($amazing_picture: String!) {
        setAmazingPicture(amazing_picture: $amazing_picture)
      }
    `
  );

  const { data: AmazingPictureUri } = useQuery<{ amazingPicture: string }>(
    gql`
      query amazingPicture {
        amazingPicture
      }
    `
  );

  const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', uploadFile);
      //   const endpoint = `http://${process.env.REACT_APP_SERVER_HOST ?? ''}:${
      //     process.env.REACT_APP_SERVER_PORT ?? ''
      //   }/upload/profile`;
      setAmazingPicture({ variables: { amazing_picture: formData } })
        .then(() => window.location.replace('/admin/AmazingPicture'))
        .catch(() => console.log('변경 실패!'));
    }
  };

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <Stack spacing={1} alignItems="center">
        {AmazingPictureUri?.amazingPicture != null ? (
          <img src={AmazingPictureUri.amazingPicture}></img>
        ) : (
          <div />
        )}
        <Box />
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
              AmazingPicture 변경
            </Button>
          </label>
        </form>
      </Stack>
    </div>
  );
}
export default AmazingPicture;
