import { useQuery } from '@apollo/client';
import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, List } from '@mui/material';
import gql from 'graphql-tag';

import { UserStatus } from '../../utils/Apollo/schemaEnums';
import UserSummary from '../commons/UserSummary';

export default function SocialDrawer(): JSX.Element {
  const {
    data: friendsData,
    // loading: friendsLoading,
    // error: friendsError,
  } = useQuery<{
    user: {
      id: string;
      friends: {
        id: string;
        nickname: string;
        status: UserStatus;
        // avatar: string;
        status_message?: string;
      }[];
    };
  }>(gql`
    query GetMyFriends {
      user {
        id
        friends {
          id
          nickname
          status
          # avatar // NOTE: 아직 에러...
          status_message
        }
      }
    }
  `);

  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          // flexShrink: 0,
          width: '200px',
          '& .MuiDrawer-paper': {
            width: '200px',
            boxSizing: 'border-box',
            bgcolor: 'grey.100',
          },
        }}
      >
        <Box>
          <IconButton>
            <ChevronRight />
          </IconButton>
          <Divider />
          {/* <UserSummary
            IUser={{
              id: '1',
              nickname: 'FORTYTWO-69195',
              avatar: 'dd',
              status: UserStatus.ONLINE,
              status_message: 'hello world',
            }}
          /> */}
          {/* <Divider /> */}
          <List>
            {friendsData?.user?.friends?.map((val) => {
              return <UserSummary key={val.id} IUser={val} />;
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
