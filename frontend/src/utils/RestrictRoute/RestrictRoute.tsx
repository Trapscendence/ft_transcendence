import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/system';
import { Redirect, Route, RouteComponentProps } from 'react-router';

import { userIdVar } from '../..';
import DirectMessage from '../../components/DirectMessage';
import Navigation from '../../components/Navigation';
import SocialDrawer from '../../components/SocialDrawer';

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

  if (userId)
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

  return <Redirect to="/login" />;
}

export default RestrictRoute;
