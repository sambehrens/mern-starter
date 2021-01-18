import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../modules/Header';

export function Landing() {
  return (
    <div>
      <Header variant={1}>Landing Page</Header>
      <Link to={'/login'}>Log in</Link>
      <Link to={'/signup'}>Sign up</Link>
    </div>
  );
}
