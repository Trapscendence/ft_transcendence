import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import Navigation from './components/Navigation';
import { Box } from '@mui/system';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Navigation />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/game" exact component={LoginPage} />
          <Route path="/game/:id" exact component={LoginPage} />
          <Route path="/chat" exact component={LoginPage} />
          <Route path="/chat/:id" exact component={LoginPage} />
        </Switch>
      </Box>
    </BrowserRouter>
  );
}

export default App;
