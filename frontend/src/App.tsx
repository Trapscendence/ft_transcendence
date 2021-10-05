import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import Navigation from './components/Navigation';
import styled from "styled-components";


const StyledDiv = styled.div`
  display:flex;
`;

function App() {
	//app css가 flex 할 수 있게 하셈~
  return (
    <BrowserRouter>
    <StyledDiv>
      <Navigation />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/game" exact component={LoginPage} />
        <Route path="/game/:id" exact component={LoginPage} />
        <Route path="/chat" exact component={LoginPage} />
        <Route path="/chat/:id" exact component={LoginPage} />
      </Switch>

      </StyledDiv>
    </BrowserRouter>
  );
}

export default App;
