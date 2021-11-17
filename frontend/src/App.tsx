import { useQuery } from '@apollo/client';
import { GlobalStyles } from '@mui/material';
import { Box } from '@mui/system';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { userIdVar } from '.';
import LoadingBackdrop from './components/commons/LoadingBackdrop';
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
import { GET_MY_ID } from './utils/gqls';
import { GetMyIdResponse } from './utils/responseModels';
import RestrictRoute from './utils/RestrictRoute';

function App(): JSX.Element {
  const { loading, data, error } = useQuery<GetMyIdResponse>(GET_MY_ID);
  console.log(error);

  // if (error) console.error(error);
  if (loading) return <LoadingBackdrop loading={loading} />;
  if (data) userIdVar(data.user?.id);

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
          <RestrictRoute exact path="/" component={HomePage} />
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
          <Route exact path="/login" component={LoginPage} />
        </Switch>
      </Box>
      <DirectMessage />
      <SocialDrawer />
    </BrowserRouter>
  );
}

export default App;
