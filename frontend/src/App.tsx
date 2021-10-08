import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import ProfilePage from './routes/ProfilePage';
import Navigation from './components/Navigation';
import { Box } from '@mui/system';
import GameListPage from './routes/GameListPage';
import ChatListPage from './routes/ChatListPage';
import RestrictRoute from './utils/RestrictRoute';
import GamePage from './routes/GamePage';
import ChatPage from './routes/ChatPage';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Navigation /> {/* DM 모달 */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <RestrictRoute exact path="/game" component={GameListPage} />
          <RestrictRoute exact path="/game/:id" component={GamePage} />
          <RestrictRoute exact path="/chat" component={ChatListPage} />
          {/* 닉네임 클릭시 모달 : 새로 만들기, 암호여부, 암호 수정하기, 타인 관리자 임명, 타인 차단, 타인 채금/강퇴, 퐁 매치 제안하기 */}
          <RestrictRoute exact path="/chat/:id" component={ChatPage} />
          <RestrictRoute exact path="/profile/my" component={ProfilePage} />
          {/* MyProfilePage로 분리될수도 있다. 수정 여부 때문에...  */}
          <RestrictRoute
            exact
            path="/profile/:userid"
            component={ProfilePage}
          />
        </Switch>
      </Box>
    </BrowserRouter>
  );
}

// dm은 냅바에 있는 버튼의 모달로 구현

export default App;
