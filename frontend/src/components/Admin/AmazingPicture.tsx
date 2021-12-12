/* eslint-disable */

import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Button, Stack } from '@mui/material';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';

function AmazingPicture(): JSX.Element {
  //TODO 권한 없을경우 권한이 없습니다. 띄우게하기
  const [updateAmazingPicture] = useMutation(
    gql`
      mutation updateAmazingPicture($file: Upload!) {
        updateAmazingPicture(file: $file)
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
  const [amazingPicture, setAmazingPicture] = useState<string>('');
  useEffect(() => {
    if (AmazingPictureUri?.amazingPicture)
      setAmazingPicture(AmazingPictureUri?.amazingPicture);
  }, [AmazingPictureUri]);

  const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      // const formData = new FormData();
      // formData.append('file', uploadFile);
      updateAmazingPicture({ variables: { file: uploadFile } })
        .then(() => window.location.replace('/admin/AmazingPicture'))
        .catch(() => console.log('변경 실패!'));
    }
  };

  return (
    <div style={{ height: '90%', width: '100%' }}>
      <Stack spacing={1} alignItems="center">
        {AmazingPictureUri?.amazingPicture != null ? (
          <div>
            <img src={'/storage/' + AmazingPictureUri.amazingPicture}></img>
            <div>AMAZING PICTURE!!!!!!!!!!!!!!!!!!!!!!!!!</div>
          </div>
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
