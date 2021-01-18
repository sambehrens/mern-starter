import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './auth/AuthProvider';
import { Landing } from './pages/Landing';
import { Login } from './auth/login/Login';
import { EnterEmail } from './auth/reset-password/EnterEmail';
import { ResetPassword } from './auth/reset-password/ResetPassword';
import { PageNotFound } from './pages/PageNotFound';
import { Signup } from './auth/register/Signup';
import { PrivateRoute } from './auth/private-route/PrivateRoute';
import { ThemeToggle } from './modules/ThemeToggle';
import { LogoutButton } from './auth/login/LogoutButton';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor.main};
    color: ${props => props.theme.textColor.main};
  }
`;

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <ThemeToggle />
        <LogoutButton />
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/reset-password/enter-email" component={EnterEmail} />
            <Route exact path="/reset-password/:jwt" component={ResetPassword} />

            <PrivateRoute exact path="/logged-in" component={LoggedInPage} />

            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

const LoggedInPage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: mediumseagreen;
`;
