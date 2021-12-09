import { useReactiveVar } from '@apollo/client';
// import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { userIdVar } from '.';
import Admin from './components/Admin';
import ChannelList from './components/ChannelList';
import RouteWithUI from './components/commons/RouteWithUI';
import Game from './components/Game';
import ObserveGame from './components/Game/ObserveGame';
import Home from './components/Home';
import Login from './components/Login';
import LoginTotp from './components/LoginTotp';
import MyProfile from './components/MyProfile';
import NotFoundPage from './components/NotFoundPage';
import Profile from './components/Profile';
import Rank from './components/Rank';
import Register from './components/Register';

export default function AppRouter(): JSX.Element {
  const userId = useReactiveVar(userIdVar);
  // const history = useHistory();
  // const location = useLocation();

  // console.log(location);

  // const loginedButNoUI = ['/game', '/observe', '/register'];

  // const noUI = loginedButNoUI.find((val) => val === location);

  return (
    <BrowserRouter>
      <Switch>
        {userId ? (
          <>
            <Route exact path="/game" component={Game} />
            <Route exact path="/observe" component={ObserveGame} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />

            <Route exact path="/home" component={Home} />
            <Route exact path="/channel" component={ChannelList} />
            <Route exact path="/rank" component={Rank} />
            <Route exact path="/setting" component={MyProfile} />
            <Route exact path="/profile/:userid" component={Profile} />
            <Route exact path="/admin" component={Admin} />

            <Route component={NotFoundPage} />

            {/* 
            <RouteWithUI exact path="/home" component={Home} />
            <RouteWithUI exact path="/channel" component={ChannelList} />
            <RouteWithUI exact path="/rank" component={Rank} />
            <RouteWithUI exact path="/setting" component={MyProfile} />
            <RouteWithUI exact path="/profile/:userid" component={Profile} />
            <RouteWithUI exact path="/admin" component={Admin} />

            <RouteWithUI component={NotFoundPage} /> */}
          </>
        ) : (
          <>
            {/* <Route exact path="/login" component={Login} />
            <Route exact path="/login/totp" component={LoginTotp} />
            <Redirect from="*" to="/login" /> */}
          </>
        )}

        {/* NOTE: LoginTotp는 잘 몰라서... 일단 제 생각대로 수정함 */}
      </Switch>
    </BrowserRouter>
  );
}
