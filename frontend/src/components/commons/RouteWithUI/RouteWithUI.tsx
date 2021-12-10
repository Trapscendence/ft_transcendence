import { Box } from '@mui/system';
import { Route, RouteComponentProps, StaticContext } from 'react-router';

import DirectMessage from '../../DirectMessage';
import Navigation from '../../Navigation';
import SocialDrawer from '../../SocialDrawer';

interface RouteWithUIProps {
  component?:
    | React.ComponentType<any>
    | React.ComponentType<RouteComponentProps<any, StaticContext, unknown>>
    | undefined;
  path?: string;
  exact?: boolean;
}

function RouteWithUI({
  component: Component,
  ...rest
}: RouteWithUIProps): JSX.Element {
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
              {Component && <Component {...props} />}
            </Box>
            <DirectMessage />
            <SocialDrawer />
          </>
        );
      }}
    />
  );
}

export default RouteWithUI;

// NOTE
// * AppRouters의 리팩토링으로 이 컴포넌트는 삭제 예정
