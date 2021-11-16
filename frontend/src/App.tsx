import { useQuery } from '@apollo/client';
import { GlobalStyles } from '@mui/material';
import { Redirect } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { userIdVar } from '.';
import LoadingBackdrop from './components/commons/LoadingBackdrop';
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
  const { loading, data } = useQuery<GetMyIdResponse>(GET_MY_ID);

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
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <RestrictRoute exact path="/home" component={HomePage} />
        <RestrictRoute exact path="/channel" component={ChannelListPage} />
        <RestrictRoute exact path="/rank" component={RankPage} />
        <RestrictRoute exact path="/rank/:userid" component={UserRankPage} />
        <RestrictRoute exact path="/profile/my" component={MyProfilePage} />
        <RestrictRoute exact path="/profile/:userid" component={ProfilePage} />
        <RestrictRoute exact path="/admin" component={AdminPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
