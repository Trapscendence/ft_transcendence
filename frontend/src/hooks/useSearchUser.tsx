import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { UsersData, UserVars } from '../components/Apollo/User';

interface UseSearchUserProps {
  data: UsersData | undefined;
  buttonActive: boolean;
  setButtonActive: React.Dispatch<React.SetStateAction<boolean>>;
}

/*
 * @params 전체유저 data, DB상 닉네임과 일치하는 Input을 찾을 시 true로 만들 hooks Event
 * Autocomplete와 TextField를 사용해서 입력값에 따라 닉네임 자동완성 제안 및 Event 활성화/비활성화
 */
export default function UseSearchUser({
  data,
  buttonActive,
  setButtonActive,
}: UseSearchUserProps): JSX.Element {
  //ANCHOR 이 유저가 존재하는지 확인하는 쿼리
  // const [getUsers, { loading, error, data }] = useLazyQuery<User, UserVars>(
  //   GET_USER
  // );
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 3,
  });
  const handleButtonActive = (buttonActive: boolean) => {
    setButtonActive(!buttonActive);
  };
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
      options={data ? data.users.map((user) => user.nickname) : ['']}
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
          onChange={() =>
            //ANCHOR TextField 인풋값이 변경될때마다 DB에있는 닉네임과 비교해서 닉네임이 존재할 경우 '다음'버튼을 활성화시켜주는 부분
            //구현필요

            handleButtonActive(buttonActive)
          }
        />
      )}
      filterOptions={filterOptions}
    />
  );
}
