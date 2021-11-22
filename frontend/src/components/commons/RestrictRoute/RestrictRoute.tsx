import { useQuery, useReactiveVar } from '@apollo/client';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { Redirect, Route, RouteComponentProps } from 'react-router';

import { userIdVar } from '../../..';
import DirectMessage from '../../DirectMessage';
import Navigation from '../../Navigation';
import SocialDrawer from '../../SocialDrawer';

interface RestrictRouteProps {
  component: React.ComponentType<RouteComponentProps> | React.ComponentType; // 맞나?
  path: string;
  exact?: boolean;
}

function RestrictRoute({
  component: Component,
  ...rest
}: RestrictRouteProps): JSX.Element {
  const userId = useReactiveVar(userIdVar);

  const { data: gameData } = useQuery<{
    user: {
      game: {
        id: string;
      };
    };
  }>(
    gql`
      query getGameByUserId($id: ID!) {
        user(id: $id) {
          game {
            id
          }
        }
      }
    `,
    {
      variables: { id: userIdVar() },
    }
  );

  if (!gameData) return <></>;
  if (!userId) return <Redirect to="/login" />;
  if (gameData.user.game.id) return <Redirect to="/game" />;

  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            <Navigation />
            <Box
              sx={{
                ml: '90px',
                width: 'calc(100% - 90px - 200px)', // NOTE: 컴포넌트 폭 등에 대한 상수? theme? 등을 만들면 편리할 듯... 지금은 그냥 값을 직접 사용한다.
                height: '100vh',
                overflowY: 'auto',
                p: 3,
              }}
            >
              <Component {...props} />
            </Box>
            <DirectMessage />
            <SocialDrawer />
          </>
        );
      }}
    />
  );
}

export default RestrictRoute;
