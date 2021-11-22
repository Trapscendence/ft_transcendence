import { useQuery, useReactiveVar } from '@apollo/client';
import { Box } from '@mui/system';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router';

import { userIdVar } from '../../..';
import DirectMessage from '../../DirectMessage';
import Navigation from '../../Navigation';
import SocialDrawer from '../../SocialDrawer';
import LoadingBackdrop from '../LoadingBackdrop';

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
  if (!userId) return <Redirect to="/login" />;

  // const {
  //   data: gameData,
  //   loading: gameLoading,
  //   refetch,
  // } = useQuery<{
  //   user: {
  //     id: string;
  //     game: {
  //       id: string;
  //     };
  //   };
  // }>(
  //   gql`
  //     query getGameByUserId($id: ID!) {
  //       user(id: $id) {
  //         id
  //         game {
  //           id
  //         }
  //       }
  //     }
  //   `,
  //   {
  //     variables: { id: userIdVar() },
  //   }
  // ); // NOTE: 접속 끊기면 게임 끝난걸로 구현할 듯... 따라서 게임 재접속 등이 필요가 없어짐

  // if (gameLoading) return <LoadingBackdrop loading={gameLoading} />;
  // if (gameData?.user.game) return <Redirect to="/game" />;

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
