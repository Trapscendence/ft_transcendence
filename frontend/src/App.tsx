import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import Navigation from './components/Navigation';
import { Box } from '@mui/system';
import GameListPage from './routes/GameListPage';
import ChatListPage from './routes/ChatListPage';
import RestrictRoute from './utils/RestrictRoute';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Navigation />
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/" component={HomePage} />
          <RestrictRoute exact path="/game" component={GameListPage} />
          <RestrictRoute exact path="/game/:id" component={GameListPage} />
          <RestrictRoute exact path="/chat" component={ChatListPage} />
          <RestrictRoute exact path="/chat/:id" component={ChatListPage} />
        </Switch>
      </Box>
    </BrowserRouter>
  );
}

export default App;
