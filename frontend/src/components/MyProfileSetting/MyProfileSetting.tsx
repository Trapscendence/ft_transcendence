import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

export default function MyProfileSetting(): JSX.Element {
  const avartarStyle = {
    height: '150px',
    width: '150px',
  };
  const paperStyle = {
    height: '200px',
    width: '100%',
  };
  const typoStyle = {
    margin: '10px',
  };

  const avatar = '';
  const nickname = 'seohchoi';
  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: false, offset: 0, limit: 0 },
  });
  const [buttonActive, setButtonActive] = useState(true);

  // const handleOnclick = (value: string) => {
  //   //TODO value를 other_id(selectedIndex)에 넣기
  //   //TODO 위를 위해서 dm 리스트 동적으로 받아오기
  //   return value;
  // };
  return <Box></Box>;
}
