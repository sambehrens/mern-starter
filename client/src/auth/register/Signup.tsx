import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createUser, CreateUserParams } from '../../api/users';

export function Signup() {
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [password2, setPassword2] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Partial<CreateUserParams>>();

  const history = useHistory();

  function onSubmit(event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();

    createUser({
      name,
      email,
      password,
      password2,
    })
      .then(() => history.push('/login'))
      .catch(errors => setErrors(errors.response.data));
  }

  return (
    <div>
      <Link to="/">Back to landing page</Link>
      <div>
        <h1>Sign up</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value)}
            id="name"
            value={name}
            type="text"
          />
          <div>{errors?.name}</div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
            id="email"
            value={email}
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
            autoComplete="new-password"
          />
          <div>{errors?.password}</div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            id="password2"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword2(event.currentTarget.value)}
            value={password2}
            type="password"
            name="password2"
            autoComplete="new-password"
          />
          <div>{errors?.password2}</div>
          <input type="submit" value="Sign up" />
        </form>
      </div>
    </div>
  );
}
