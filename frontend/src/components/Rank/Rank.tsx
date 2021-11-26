import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

export default function RankPage(): JSX.Element {
  const avartarStyle = {
    height: '40px',
    width: '40px',
    margin: '10px',
  };

  const { error, data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
    variables: { ladder: true, offset: 0, limit: 0 },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack justifyContent="center" alignItems="center">
        <h3>Rank Page</h3>

        {data?.users.map((user, index) => (
          <Box>
            <Divider light />
            <Stack
              sx={{ margin: '10px' }}
              justifyContent="center"
              alignItems="center"
              direction={{ xs: 'column', sm: 'row' }}
            >
              <h4>{index + 1} </h4>
              <Avatar sx={avartarStyle}>
                {user?.nickname[0]?.toUpperCase()}
              </Avatar>
              <Typography>{user.nickname}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
