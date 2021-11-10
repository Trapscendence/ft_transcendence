import { gql, useLazyQuery, useQuery } from '@apollo/client';
import SearchIcon from '@mui/icons-material/Search';
// import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

interface User {
  id: number;
  nickname: string;
}

const GET_USERS = gql`
  query getUsers($ladder: Boolean!, $offset: Int!, $limit: Int!) {
    users(ladder: $ladder, offset: $offset, limit: $limit) {
      id
      nickname
    }
  }
`;

interface UserData {
  users: User[];
}

interface UserDataVars {
  ladder: boolean;
  offset: number;
  limit: number;
}
// NOTE 여기까지는 가능하면 다른 파일에 export로 내보내둘것

function NewDirectMessage(): JSX.Element {
  // const [getUsers, { loading, error, data }] = useLazyQuery<UserData,UserDataVars>(GET_USERS);
  const { loading, error, data } = useQuery<UserData, UserDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });
  // const Users: string[] = [];
  // data?.users.map((user) => Users.push(user.nickname));
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 3,
    // stringify: (option) => option.title,
  });
  if (error) return <div>Error! {error}</div>;

  if (data)
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          disabled
          //NOTE data 목록에 사용자의 input값이 없으면 다음 버튼이 활성화 되지 않아야 함
          size="medium"
          sx={{ margin: '5px 0px', width: '10px' }}
        >
          다음
        </Button>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <SearchIcon sx={{ paddingTop: '5px' }} color="primary" />
          <Autocomplete
            sx={{
              width: '100%',
            }}
            freeSolo
            id="user-nickname"
            autoComplete
            options={data.users.map((user) => user.nickname)}
            // {()=>getUsers({variables: { ladder: false, offset: 0, limit: 0 },})}
            // options={data ? data.user.map(nickname) => nickname)} : "loading..."}
            renderInput={(params) => (
              <TextField
                {...params}
                hiddenLabel
                id="filled-hidden-label-small"
                label={'사용자 검색'}
                margin="dense"
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
            filterOptions={filterOptions}
          />
        </Stack>
      </Box>
    );
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default NewDirectMessage;
