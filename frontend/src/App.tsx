import { useQuery } from '@apollo/client';
import { GlobalStyles } from '@mui/material';
import { Redirect } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { userIdVar } from '.';
import Admin from './components/Admin';
import ChannelList from './components/ChannelList';
import LoadingBackdrop from './components/commons/LoadingBackdrop';
import RestrictRoute from './components/commons/RestrictRoute';
import Home from './components/Home';
import Login from './components/Login';
import LoginTotp from './components/LoginTotp';
import MyProfile from './components/MyProfile';
import Profile from './components/Profile';
import Rank from './components/Rank';
import UserRank from './components/UserRank';
import { GET_MY_ID } from './utils/Apollo/gqls';
import { GetMyIdResponse } from './utils/Apollo/responseModels';

function App(): JSX.Element {
  const { loading, data, error } = useQuery<GetMyIdResponse>(GET_MY_ID);

  if (error) console.error(error);
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
        <Route exact path="/login/totp" component={LoginTotp} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <RestrictRoute exact path="/home" component={Home} />
        <RestrictRoute exact path="/channel" component={ChannelList} />
        <RestrictRoute exact path="/rank" component={Rank} />
        <RestrictRoute exact path="/rank/:userid" component={UserRank} />
        <RestrictRoute exact path="/profile/my" component={MyProfile} />
        <RestrictRoute exact path="/profile/:userid" component={Profile} />
        <RestrictRoute exact path="/admin" component={Admin} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
