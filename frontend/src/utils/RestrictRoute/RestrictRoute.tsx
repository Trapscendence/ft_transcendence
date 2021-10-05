import { useReactiveVar } from '@apollo/client';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { isLoginVar } from '../..';

interface RestrictRouteProps {
  component: React.ComponentType<RouteComponentProps> | React.ComponentType; // 맞나?
  path: string;
  exact?: boolean;
}

function RestrictRoute({
  component: Component,
  ...rest
}: RestrictRouteProps): JSX.Element {
  const isLogin = useReactiveVar(isLoginVar);

  return (
    <Route
      {...rest}
      render={(props) => {
        return isLogin ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
}

export default RestrictRoute;
