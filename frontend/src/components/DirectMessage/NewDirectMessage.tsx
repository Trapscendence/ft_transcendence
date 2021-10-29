import { useQuery } from '@apollo/client';
import SearchIcon from '@mui/icons-material/Search';
// import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  // Divider,
  // IconButton,
  // InputAdornment,
  Stack,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

import UseSearchUser from '../../hooks/useSearchUser';
import { UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

// NOTE 여기까지는 가능하면 다른 파일에 export로 내보내둘것

function NewDirectMessage(): JSX.Element {
  //ANCHOR 전체 유저리스트 받아오는 쿼리
  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });

  const [buttonActive, setButtonActive] = useState(true);

  if (data || error)
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
          disabled={buttonActive}
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
          <UseSearchUser {...{ users: data, setButtonActive }} />
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
