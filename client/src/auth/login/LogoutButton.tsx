import * as React from 'react';
import { useAuth } from '../AuthProvider';

export function LogoutButton() {
  const {logout} = useAuth();

  return <button onClick={() => logout()}>Log out</button>
}