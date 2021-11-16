import { useLazyQuery } from '@apollo/client';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { NickName, User, UserData, UsersData } from '../utils/Apollo/User';
import { GET_USER_BY_NICKNAME } from '../utils/Apollo/UserQuery';

interface UseSearchUserProps {
  users: UsersData | undefined;
  setButtonActive: React.Dispatch<React.SetStateAction<boolean>>;
  setInputSpace: React.Dispatch<React.SetStateAction<User>>;
}

/*
 * @params 전체유저 data, DB상 닉네임과 일치하는 Input을 찾을 시 true로 만들 hooks Event
 * Autocomplete와 TextField를 사용해서 입력값에 따라 닉네임 자동완성 제안 및 Event 활성화/비활성화
 */
export default function UseSearchUser({
  users,
  setButtonActive,
  setInputSpace,
}: UseSearchUserProps): JSX.Element {
  // ANCHOR 이 유저가 존재하는지 확인하는 쿼리
  const [getUser, { data }] = useLazyQuery<UserData, NickName>(
    GET_USER_BY_NICKNAME
  );
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 3,
  });
  if (data?.user) {
    setButtonActive(false);
    setInputSpace(data?.user);
  } else setButtonActive(true);

  return (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      freeSolo
      id="user-nickname"
      autoComplete
      // options={data.users.map((user) => user.nickname)}
      // {()=>getUsers({variables: { ladder: false, offset: 0, limit: 0 },})}
      options={users ? users.users.map((user) => user.nickname) : ['']}
      renderInput={(params) => (
        <TextField
          {...params}
          hiddenLabel
          id="filled-search-with"
          label={'사용자 검색'}
          margin="dense"
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
      filterOptions={filterOptions}
      onInputChange={(event, value) =>
        //ANCHOR TextField 인풋값이 변경될때마다 DB에있는 닉네임과 비교해서 닉네임이 존재할 경우 '다음'버튼을 활성화시켜주는 부분
        {
          getUser({ variables: { nickname: value } });
        }
      }
    />
  );
}
