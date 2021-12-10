import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/material';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { userIdVar } from '.';
import Admin from './components/Admin';
import ChannelList from './components/ChannelList';
import DirectMessage from './components/DirectMessage';
import Game from './components/Game';
import ObserveGame from './components/Game/ObserveGame';
import Home from './components/Home';
import Login from './components/Login';
import LoginTotp from './components/LoginTotp';
import MyProfile from './components/MyProfile';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Rank from './components/Rank';
import Register from './components/Register';
import SocialDrawer from './components/SocialDrawer';

export default function AppRouters(): JSX.Element {
  const userId = useReactiveVar(userIdVar);
  const location = useLocation();

  const loginedButNoUI = ['/game', '/observe', '/register'];
  const isNoUI = loginedButNoUI.find((val) => val === location.pathname);

  return (
    <Switch>
      {!userId && (
        <>
          <Route exact path="/login" component={Login} />
          <Route exact path="/login/totp" component={LoginTotp} />
          {/* <Redirect from="*" to="/login" /> */}
        </>
      )}

      {userId && isNoUI && (
        <>
          <Route exact path="/game" component={Game} />
          <Route exact path="/observe" component={ObserveGame} />
          <Route exact path="/register" component={Register} />
        </>
      )}

      {userId && !isNoUI && (
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
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/channel" component={ChannelList} />
            <Route exact path="/rank" component={Rank} />
            <Route exact path="/setting" component={MyProfile} />
            <Route exact path="/profile/:userid" component={Profile} />
            <Route exact path="/admin" component={Admin} />
            <Redirect to="/home" />
          </Box>
          <DirectMessage />
          <SocialDrawer />
        </>
      )}
    </Switch>
  );
}

// NOTE
// * 로그인 됐을 때 올바르지 않은 path로 가면 home으로 리다이렉트하게 구현
