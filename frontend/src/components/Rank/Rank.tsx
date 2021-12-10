import { useQuery } from '@apollo/client';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';

import { UsersData, UsersDataVars } from '../../utils/Apollo/User';
import { GET_USERS } from '../../utils/Apollo/UserQuery';

export default function RankPage(): JSX.Element {
  const avartarStyle = {
    height: '40px',
    width: '40px',
    margin: '10px',
  };

  const { data } = useQuery<UsersData, UsersDataVars>(GET_USERS, {
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
          <Box key={user.id}>
            <Divider light />
            <Stack
              sx={{ margin: '10px' }}
              justifyContent="center"
              alignItems="center"
              direction={{ xs: 'column', sm: 'row' }}
            >
              <h4>{index + 1} </h4>
              {user?.avatar ? (
                <Avatar
                  sx={avartarStyle}
                  src={'/storage/' + user?.avatar}
                ></Avatar>
              ) : (
                <Avatar sx={avartarStyle}>
                  {user?.nickname[0]?.toUpperCase()}
                </Avatar>
                // <Skeleton variant="circular" sx={avartarStyle} />
              )}

              <Typography>{user.nickname}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
