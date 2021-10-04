import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/game" exact component={LoginPage} />
        <Route path="/game/:id" exact component={LoginPage} />
        <Route path="/chat" exact component={LoginPage} />
        <Route path="/chat/:id" exact component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
