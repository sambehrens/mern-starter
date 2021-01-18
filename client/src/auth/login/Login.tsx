import * as React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { AxiosError } from 'axios';
import { useAuth } from '../AuthProvider';
import { LoginUserParams } from '../../api/auth';
import { Header } from '../../modules/Header';

export function Login() {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Partial<LoginUserParams>>();

  const { loggedInUser, login } = useAuth();

  const location = useLocation<{ from?: string } | undefined>();
  const history = useHistory();

  const defaultPath = '/logged-in';

  React.useEffect(() => {
    if (loggedInUser) {
      history.push(location.state?.from ?? defaultPath);
    }
  }, [loggedInUser, history, location]);

  function onSubmit(event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();

    login({ email, password }).catch((error: AxiosError) => {
      setErrors(error.response?.data);
    });
  }

  return (
    <div>
      <Link to="/">Back to landing page</Link>
      <div>
        <Header variant={1}>Log in</Header>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
            value={email}
            name="email"
            type="email"
            autoComplete="email"
          />
          <div>{errors?.email}</div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
            value={password}
            type="password"
            name="password"
            autoComplete="current-password"
          />
          <div>{errors?.password}</div>
          <input type="submit" value="Log in" />
        </form>
      </div>
      <div>
        <Link to="/reset-password/enter-email">Forgot password?</Link>
      </div>
    </div>
  );
}
