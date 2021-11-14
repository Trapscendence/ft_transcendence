import { useReactiveVar } from '@apollo/client';
import { Redirect, Route, RouteComponentProps } from 'react-router';

import { userIdVar } from '../..';

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
    return <Route {...rest} render={(props) => <Component {...props} />} />;

  return <Redirect to="/login" />;
}

export default RestrictRoute;
