import { GlobalStyles } from '@mui/material';
import { Box } from '@mui/system';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DirectMessage from './components/DirectMessage';
import Navigation from './components/Navigation';
import SocialDrawer from './components/SocialDrawer';
import AdminPage from './routes/AdminPage';
import ChannelListPage from './routes/ChannelListPage';
import ChannelPage from './routes/ChannelPage';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import MyProfilePage from './routes/MyProfilePage';
import ProfilePage from './routes/ProfilePage';
import RankPage from './routes/RankPage';
import UserRankPage from './routes/UserRankPage';
import RestrictRoute from './utils/RestrictRoute';

function App(): JSX.Element {
  // TODO: 스크롤을 페이지 내부로 옮기고 싶다. 맨 오른쪽 스크롤은 SocialDrawer에 대한 스크롤만 나타나도록...

  return (
    <BrowserRouter>
      <GlobalStyles
        // styles={{ html: { overflowY: 'scroll' }, body: darkScrollbar() }}
        styles={{
          html: { overflowY: 'scroll' },
          // html: { overflowY: 'hidden' },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Navigation />
        <Box sx={{ ml: '90px' }}>
          {/* <Box sx={{ ml: '90px', overflowY: 'scroll' }}> */}
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <RestrictRoute exact path="/channel" component={ChannelListPage} />
            <RestrictRoute
              exact
              path="/channel/:channelid"
              component={ChannelPage}
            />
            <RestrictRoute exact path="/rank" component={RankPage} />
            <RestrictRoute
              exact
              path="/rank/:userid"
              component={UserRankPage}
            />
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
      </Box>
    </BrowserRouter>
  );
}

export default App;
