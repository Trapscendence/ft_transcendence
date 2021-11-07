import { GlobalStyles } from '@mui/material';
import { Box } from '@mui/system';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DirectMessage from './components/DirectMessage';
import Navigation from './components/Navigation';
import SocialDrawer from './components/SocialDrawer';
import AdminPage from './routes/AdminPage';
import ChannelListPage from './routes/ChannelListPage';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import MyProfilePage from './routes/MyProfilePage';
import ProfilePage from './routes/ProfilePage';
import RankPage from './routes/RankPage';
import UserRankPage from './routes/UserRankPage';
import RestrictRoute from './utils/RestrictRoute';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <GlobalStyles
        styles={{
          body: { overflowY: 'hidden' }, // NOTE: html이 아니라 body에 주로 적용하는 듯
        }}
      />
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
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <RestrictRoute exact path="/channel" component={ChannelListPage} />
          <RestrictRoute exact path="/rank" component={RankPage} />
          <RestrictRoute exact path="/rank/:userid" component={UserRankPage} />
          <RestrictRoute exact path="/profile/my" component={MyProfilePage} />
          <RestrictRoute
            exact
            path="/profile/:userid"
            component={ProfilePage}
          />
          <RestrictRoute exact path="/admin" component={AdminPage} />
        </Switch>
      </Box>
      <DirectMessage />
      <SocialDrawer />
    </BrowserRouter>
  );
}

export default App;
