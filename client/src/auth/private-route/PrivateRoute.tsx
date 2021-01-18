import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export interface PrivateRouteProps extends RouteProps {
  blockAccessTo?: string;
  component: React.FC;
}

export function PrivateRoute({ component: Component, blockAccessTo = '', ...rest }: PrivateRouteProps) {
  const { loggedInUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedInUser && !loggedInUser.accessLevel) {
          throw new Error('User must have an access level.');
        }

        if (loggedInUser && loggedInUser?.accessLevel !== blockAccessTo) {
          return <Component />;
        }

        if (loggedInUser?.accessLevel === blockAccessTo) {
          return <Redirect to={'/not-found'} />;
        }

        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location.pathname },
            }}
          />
        );
      }}
    />
  );
}
